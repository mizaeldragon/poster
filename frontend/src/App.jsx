import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/post`);
      console.log("Dados recebidos:", response.data);
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPost) {
        await axios.put(`${apiUrl}/post/${editPost}`, {
          title,
          content,
        });
      } else {
        await axios.post(`${apiUrl}/post`, {
          title,
          content,
          userId: 1,
        });
      }
      fetchPosts();
      setTitle("");
      setContent("");
      setEditPost(null);
    } catch (error) {
      console.error("Erro ao enviar post:", error);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditPost(post.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este post?")) {
      try {
        await axios.delete(`${apiUrl}/post/${id}`);
        fetchPosts();
      } catch (error) {
        console.error("Erro ao deletar post:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-col bg-gradient-to-r to-zinc-700 from-slate-950 w-full h-screen">
      <h1 className="text-5xl font-bold mb-12 text-white">Posts</h1>
      <form onSubmit={handleSubmit} className="mb-4 w-96">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titulo"
          className="mb-4 text-white"
          required
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conteudo"
          className="text-white"
          required
        />
        <button
          type="submit"
          className={`p-2 rounded mt-8 mb-12 ${
            !title || !content
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
          disabled={!title || !content}
        >
          {editPost ? "Atualizar Poster" : "Criar Poster"}
        </button>
      </form>
      <ScrollArea className="h-[250px] w-[381px] -ml-1 rounded border-2 p-6 text-white">
        {loading ? (
          <p className="text-center text-white">Carregando posts...</p>
        ) : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
              <button
                onClick={() => handleEdit(post)}
                className="text-green-500 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-500"
              >
                Deletar
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-white">Nenhum post disponível.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [editarPost, setEditarPost] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarPosts();
  }, []);

  const buscarPosts = async () => {
    try {
      setCarregando(true);
      const resposta = await axios.get(
        "https://poster-rose.vercel.app/api/post"
      );
      console.log("Dados recebidos:", resposta.data);
      setPosts(Array.isArray(resposta.data) ? resposta.data : []);
    } catch (erro) {
      console.error("Erro ao buscar posts:", erro);
      setPosts([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editarPost) {
        await axios.put(
          `https://poster-rose.vercel.app/api/post/${editarPost}`,
          {
            title: titulo,
            content: conteudo,
          }
        );
      } else {
        await axios.post("https://poster-rose.vercel.app/api/post", {
          title: titulo,
          content: conteudo,
          userId: 1,
        });
      }
      buscarPosts();
      setTitulo("");
      setConteudo("");
      setEditarPost(null);
    } catch (erro) {
      console.error("Erro ao enviar post:", erro);
    }
  };

  const handleEdit = (post) => {
    setTitulo(post.title);
    setConteudo(post.content);
    setEditarPost(post.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este post?")) {
      try {
        await axios.delete(`https://poster-rose.vercel.app/api/post/${id}`);
        buscarPosts();
      } catch (erro) {
        console.error("Erro ao deletar post:", erro);
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-col bg-gradient-to-r to-zinc-700 from-slate-950 w-full h-screen">
      <h1 className="text-5xl font-bold mb-12 text-white">Posts</h1>
      <form onSubmit={handleSubmit} className="mb-4 w-96">
        <Input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          className="mb-4 text-white"
          required
        />
        <Textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Conteúdo"
          className="text-white"
          required
        />
        <button
          type="submit"
          className={`p-2 rounded mt-8 mb-12 ${
            !titulo || !conteudo
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
          disabled={!titulo || !conteudo}
        >
          {editarPost ? "Atualizar Post" : "Criar Post"}
        </button>
      </form>
      <ScrollArea className="h-[250px] w-[381px] -ml-1 rounded border-2 p-6 text-white">
        {carregando ? (
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

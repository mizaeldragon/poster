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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get("http://localhost:3000/posts");
    setPosts(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editPost) {
      await axios.put(`http://localhost:3000/posts/${editPost}`, {
        title,
        content,
      });
    } else {
      await axios.post("http://localhost:3000/posts", {
        title,
        content,
        userId: 1,
      });
    }
    fetchPosts();
    setTitle("");
    setContent("");
    setEditPost(null);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditPost(post.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/posts/${id}`);
    fetchPosts();
  };

  return (
    <div className="flex justify-center items-center flex-col bg-gradient-to-r to-zinc-700 from-slate-950 w-full h-screen ">
      <h1 className="text-5xl font-bold mb-12 text-white">Posts</h1>
      <form onSubmit={handleSubmit} className="mb-4 w-96">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-4 text-white"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 hover:bg-blue-700 rounded mt-8 mb-12"
        >
          {editPost ? "Update Post" : "Create Post"}
        </button>
      </form>
      <ScrollArea className="h-[250px] w-[381px] -ml-1 rounded border-2 p-6 text-white">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
            <button
              onClick={() => handleEdit(post)}
              className="text-green-500 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default App;

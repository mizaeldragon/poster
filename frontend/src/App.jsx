import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 mb-2 w-full"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {editPost ? "Update Post" : "Create Post"}
        </button>
      </form>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="border p-4 mb-2">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
            <button
              onClick={() => handleEdit(post)}
              className="text-blue-500 mr-2"
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
      </div>
    </div>
  );
};

export default App;

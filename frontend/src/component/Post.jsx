// Post.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Post = ({ match }) => {
  const [post, setPost] = useState({});

  useEffect(() => {
    // Fetch individual blog post by ID from the backend API
    const postId = match.params.id;
    axios
      .get(`http://localhost:3000/api/posts/${postId}`)
      .then((response) => setPost(response.data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [match.params.id]);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default Post;

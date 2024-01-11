import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const Home = () => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Fetch blog posts from the backend API
    axios
      .get("http://127.0.0.1:3000/api/v1/auth/home")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const getImageUrl = (filename) => {
    return `http://127.0.0.1:3000/api/v1/auth/getImage/${filename}`;
  };

  return (
    <div>
      <h1>Blog Posts</h1>

      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              {post.pictures && post.pictures.length > 0 && (
                <div>
                  {post.pictures.map((picture, index) => (
                    <img
                      key={index}
                      src={picture.image}
                      alt={`Post Picture ${index}`}
                      width="100"
                    />
                  ))}
                </div>
              )}
            </div>
            <a href={`/post/${post._id}`}>Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

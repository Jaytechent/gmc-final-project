import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [previewPictures, setPreviewPictures] = useState([]);

  useEffect(() => {
    // Fetch categories for the dropdown from the backend API
    axios
      .get("http://localhost:3000/api/categories")
      .then((response) => {
        setCategories(response.data);
        console.log("Fetched categories:", response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handlePictureChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to a maximum of 4 pictures
    if (files.length > 4) {
      window.alert("You can upload a maximum of 4 pictures.");
      return;
    }

    setPictures(files);

    // Preview pictures
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewPictures(previews);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", selectedCategory);

      pictures.forEach((picture) => {
        formData.append("pictures", picture);
      });

      await axios.post("http://localhost:3000/api/posts", formData);

      window.alert("Post Created Successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h1>Create a New Blog Post</h1>
      <form>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <label>Pictures:</label>
        <input type="file" multiple onChange={handlePictureChange} />

        {previewPictures.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index}`} width="100" />
        ))}

        <button type="button" onClick={handleSubmit}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

// CategoryList.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const  BASE_URL =   import.meta.env.VITE_BASE_URL
  useEffect(() => {
    // Fetch categories from the backend API
    axios
      .get(`${BASE_URL}/api/v1categories`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;

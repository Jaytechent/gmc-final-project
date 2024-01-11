// routes/categories.js
const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("Fetched categories:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
  },
  { collection: "categories" }
); // Specify the collection name

const Category = mongoose.model("Category", categorySchema); // Specify the database name

module.exports = Category;

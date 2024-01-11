const express = require("express");
const postController = require("../controllers/postControllers");
const path = require("path");

const router = express.Router();

// Define a route for fetching images
router.get("/getImage/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "/uploads", filename);

  // Send the image file in the response
  res.sendFile(imagePath);
});

// Route to fetch all posts with images
router.get("/", postController.getAllPostsWithImages);

module.exports = router;

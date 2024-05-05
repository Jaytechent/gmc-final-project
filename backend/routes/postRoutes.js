const express = require("express");
const { check } = require("express-validator");
const postController = require("../controllers/postControllers");
const upload = require("../middleware/upload");

const router = express.Router();

// Route to create a new post
router.post(
  "/",

  upload.array("pictures", 4), // Handle file uploads here
  postController.createPost
);
router.post('/comment/:id', postController.addComment);
router.post('/like/:id', postController.addLike);
router.delete('/delete/:id', postController.deletePost);
router.put('/update/:id', postController.UpdatePost);

module.exports = router;

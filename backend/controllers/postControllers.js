const Post = require("../models/postModel");
const { CustomErrorHandler } = require("../middleware/errorhandler");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const path = require("node:path");
const createPost = async (req, res) => {
  const { title, content, category, author } = req.body;

  if (
    validator.isEmpty(title.trim()) ||
    validator.isEmpty(content.trim()) ||
    validator.isEmpty(category.trim())
    // validator.isEmpty(author.trim())
  ) {
    throw new CustomErrorHandler(404, `Your Inputs are not correct`);
  }

  // Check if pictures were uploaded
  const pictures =
    req.files && req.files.length > 0 ? req.files.map((file) => file.path) : [];

  const image = await Promise.all(
    pictures.map(async (picture) => {
      console.log(picture);
      const result = await cloudinary.uploader.upload(picture);
      return { image: result.secure_url, public_id: result.public_id };
    })
  );

  // Delete the uploaded files one by one
  pictures.forEach((picture) => {
    fs.unlinkSync(picture);
  });
  try {
    const newPost = await Post.create({
      title,
      content,
      category,
      author,
      pictures: image,
    });

    // Fetch the newly created post with populated category and return in the response
    const populatedPost = await Post.findById(newPost._id).populate("category");

    res
      .status(201)
      .json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPostsWithImages = async (req, res) => {
  try {
    const posts = await Post.find().populate("category");

    // Add image URLs to each post
    const postsWithImages = posts.map((post) => {
      const images = post.pictures.map((picture) => {
        const imageUrl = `http://127.0.0.1:3000/api/v1/auth/getImage/${picture}`;
        return imageUrl;
      });

      return {
        ...post._doc,
        images,
      };
    });

    res.json(postsWithImages);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPost,
  getAllPostsWithImages,
};

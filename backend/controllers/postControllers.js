const Post = require("../models/postModel");
const { CustomErrorHandler } = require("../middleware/errorhandler");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const path = require("node:path");

const PostModel = require("../models/postModel");
const userModel = require("../models/userModels");
const createPost = async (req, res) => {
  const { title, content, category, author, authorId } = req.body;
  

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
      authorId,
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
  const page = req.query.pageNumber
  try {
    const posts = await Post.find().sort({
      createdAt: "desc"
    }).skip(page * 21).limit(21).populate("category")
    console.log(posts, posts.length, page);
    // ALll posts in the DB to know the number of pagination I will have
    // 100 / 20 - 5-1
    const allPosts = await Post.find().countDocuments();
    console.log(allPosts);

    require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_URL
    // Add image URLs to each post
    const postsWithImages = posts.map((post) => {
      const images = post.pictures.map((picture) => {
        const imageUrl = `${BACKEND_URL}/api/v1/auth/getImage/${picture}`;
        return imageUrl;
      });

      return {
        ...post._doc,
        images,
        };
      });

    res.json({posts: posts, allPosts});
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const addComment = async (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  const userid = req.user.userId; // Assuming you have user authentication
console.log(postId);
  const post = await PostModel.findById(postId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const comment = { user: userid, text, images };
  post.comments.push(comment);
  await post.save();

  res.json({ message: 'Comment added successfully', comment });
};

const addLike = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id; // Assuming you have user authentication

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.likes.includes(userId)) {
    return res.status(400).json({ error: 'You already liked this post' });
  }

  post.likes.push(userId);
  await post.save();

  res.json({ message: 'Like added successfully', likes: post.likes });
};


const deletePost = async (req, res) => {
  const postId = req.params.id

  console.log(postId)

  const deletedPost = await PostModel.findByIdAndDelete({_id:postId})


console.log(deletedPost)

  res.status(204).json({message:"post deleted successfully"})
}





const UpdatePost = async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body; // Assuming you're sending the updated content in the request body

  try {
    // Find the post by ID and update the specified fields
    const updatedPost = await PostModel.findByIdAndUpdate(
      { _id: postId },
      { content }, // Include other fields you want to update
      { new: true } // This option returns the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports = {
  createPost,
  getAllPostsWithImages,
  addComment,
  addLike, 
  deletePost,
  UpdatePost
};

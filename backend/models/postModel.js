const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    pictures: [
      {
        image: String,
        public_id: String,
      },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    author: String,
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;

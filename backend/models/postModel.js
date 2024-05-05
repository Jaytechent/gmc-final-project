const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pictures: [{ image: String, public_id: String }],
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, images: [{ image: String, public_id: String }] }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

const PostModel = mongoose.model('Post', postSchema);




module.exports = PostModel;

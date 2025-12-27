import mongoose from 'mongoose';

// If this file needs the Post model (e.g., for references), retrieve it without compiling
const Post = mongoose.model('Post');  // Retrieves existing model—do NOT pass a schema here!

// Define the actual Comment schema (add this if it's missing; adjust fields as needed)
const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',  // References the existing Post model
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compile ONLY the Comment model here
const Comment = mongoose.model('Comment', commentSchema);

// Export the Comment model (and Post if needed elsewhere)
export default Comment;
export { Post };
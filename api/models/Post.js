import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Post || mongoose.model("Post", postSchema);

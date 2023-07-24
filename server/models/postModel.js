import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        desc: { type: String, require: true },
        likes: [],
        createAt: {
            type: Date,
            default: new Date(),
        },
        images: String,
    },
    { timestamps: true }
);

var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
import mongoose, { Schema, model, Types } from "mongoose";
const postSchema = new Schema(
  {

   
  },
  {
    timestamps: true,
  }
);

const postModel =mongoose.models.Post || model("Post", postSchema);
export default postModel;
import mongoose, { Schema, model, Types } from "mongoose";
const postSchema = new Schema(
  {
    title:{
      type: String,
      required:true
     },
     caption:{
      type: String
     },
     image:{
      type: Object,
      required:true
     },
     user_Id:{
      type: Types.ObjectId,
      ref:"User",
      required:true
     },   
     like:[{
      type: Types.ObjectId,
      ref:"User",
     }],
     unlike:[{
      type: Types.ObjectId,
      ref:"User",
     }],
     isDeleted:{
      type:Boolean,
      default:false
  },
  privacy :{
    type: String,
    default: "public",
    enum: ["public", "private","friends-only"]
        },
  },
  {
    timestamps: true,
  }
);

const PostModel =mongoose.models.Post || model("Post", postSchema);
export default PostModel;
import mongoose, { Schema, model, Types } from "mongoose";
const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
    },
    user_Id: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    post_Id: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    isDeleted:{
      type:Boolean,
      default:false
  },
    like: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    unlike: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
   
  },
  {
    timestamps: true,
  }
);

const CommentModel =mongoose.models.Comment || model("Comment", commentSchema);
export default CommentModel;
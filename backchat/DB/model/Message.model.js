import mongoose, { Schema, model, Types } from "mongoose";
const messageSchema = new Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
   
  },
  {
    timestamps: true,
  }
);

const messageModel =mongoose.models.Message || model("Message", messageSchema);
export default messageModel;
import mongoose, { Schema, model, Types } from "mongoose";
const FriendSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt fields
  }
);

const FriendModel =mongoose.models.Friend || model("Friend", FriendSchema);
export default FriendModel;
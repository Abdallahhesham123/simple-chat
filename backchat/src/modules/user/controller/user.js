import UserModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

import cloudinary from "../../../utils/cloudinary.js";
import FriendModel from "../../../../DB/model/Friends.model.js";
import PostModel from "../../../../DB/model/Post.model.js";
import CommentModel from "../../../../DB/model/Comment.model.js";
export const getUser = async (req, res, next) => {
  try {
    const users = await UserModel.find({
      status: "Online",
      _id: { $ne: `${req.user._id}` },
      isDeleted: false
    }).select("username email image");
    return res.json({ message: "Done", users });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};

export const findByIdAndUpdate = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `user/${req.user._id}/profilePic` }
    );
    req.body.image = { secure_url, public_id };
  }

  const user = await UserModel.findByIdAndUpdate(
    { _id: req.user._id, isDeleted: false },

    req.body,
    { new: false }
  );

  await cloudinary.uploader.destroy(user?.image?.public_id);
  // console.log(user);
  return user
    ? res.json(user )
    : next(new Error("InValid-UserId", { cause: 404 }));
});

export const getProfile = asyncHandler(async (req, res, next) => {
  //   const { id } = req.params;
  const user = await UserModel.findOne({
    _id: req.user._id,
    isDeleted: false,
    confirmEmail: true,
  }).select("-password -confirmEmail -isDeleted ");
  return user
    ? res.json({ message: "user Profile Founded Sucsessfully", user })
    : next(new Error("InValid-UserId"));
});

export const findOneAndDelete = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOneAndDelete(
    { _id: req.user._id, isDeleted: false },
    { new: false }
  );
  await cloudinary.uploader.destroy(user.image.public_id);
  return user
    ? res.json({ message: "user Deleted Sucsessfully from database" })
    : next(new Error("InValid-UserId"));
});

export const profilePicUpdated = asyncHandler(async (req, res, next) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `user/${req.user._id}/profilePic` }
  );

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { image: { secure_url, public_id } },
    { new: false }
  );
  await cloudinary.uploader.destroy(user.image.public_id);
  return res.json({ message: "Done", user });
});

export const softDelete = asyncHandler(async (req, res, next) => {
  const user = await UserModel.updateOne(
    { _id: req.user._id, isDeleted: false },
    { isDeleted: true }
  );

  return user.modifiedCount
    ? res.json({
        message: "user deleted Sucsessfully but this user in database",
      })
    : next(new Error("InValid-UserId"));
});

export const restoretodatabase = asyncHandler(async (req, res, next) => {
  const user = await UserModel.updateOne(
    { _id: req.user._id, isDeleted: true },
    { isDeleted: false }
  );

  return user.modifiedCount
    ? res.json({
        message: "user Restored Sucsessfully and your post Restored",
      })
    : next(new Error("InValid-UserId"));
});

export const logout = asyncHandler(async (req, res, next) => {
  const user = await UserModel.updateOne(
    { _id: req.user._id },
    { status: "Offline" }
  );

  return user.modifiedCount
    ? res.json({
        message: "successfully Logout",
      })
    : next(new Error("InValid-UserId"));
});

//send friend request

export const friendRequest = asyncHandler(async (req, res, next) => {
  const friendRequest = new FriendModel({
    sender: req.user._id, // the user sending the request
    recipient: req.body.recipient, // the user receiving the request
  });
  await friendRequest.save();
  res.status(201).json({ message: "friend request is sending" });
});

export const acceptfriendRequest = asyncHandler(async (req, res, next) => {
  const friendRequest = await FriendModel.findOneAndUpdate(
    {
      _id: req.params.id,
      recipient: req.user._id, // the user receiving the request
      status: "pending",
    },
    {
      $set: {
        status: "accepted",
      },
    },
    { new: true }
  );
  if (!friendRequest) {
    return next(new Error("InValid-request"));
  }
  // add friend to sender's friends list
  await UserModel.findByIdAndUpdate(friendRequest.sender, {
    $push: { friends: friendRequest.recipient },
  });
  // add friend to recipient's friends list
  await UserModel.findByIdAndUpdate(friendRequest.recipient, {
    $push: { friends: friendRequest.sender },
  });
  res.status(200).json("Done");
});

export const rejectfriendRequest = asyncHandler(async (req, res) => {
  const friendRequest = await FriendModel.findOneAndUpdate(
    {
      _id: req.params.id,
      recipient: req.user._id, // the user receiving the request
      status: "pending",
    },
    {
      $set: {
        status: "rejected",
      },
    },
    { new: true }
  );
  if (!friendRequest) {
    return res.status(404).json({ message: "error in request" });
  }
  res.status(200).json({ message: "request is rejected" });
});

export const PendingRequest = asyncHandler(async (req, res) => {
  const friendRequests = await FriendModel.find({
    recipient: req.user._id, // the user receiving the requests
    status: "pending",
  })
    .populate("sender", "name") // include sender's name
    .exec();
  res.json(friendRequests);
});

export const unfriendRequest = asyncHandler(async (req, res, next) => {
  const friendRequest = await FriendModel.findOneAndUpdate(
    {
      _id: req.params.id,
      recipient: req.user._id, // the user receiving the request
      status: "accepted",
    },
    {
      $set: {
        status: "pending",
      },
    },
    { new: true }
  );
  if (!friendRequest) {
    return next(new Error("InValid-request"));
  }
  // add friend to sender's friends list
  await UserModel.findByIdAndUpdate(friendRequest.sender, {
    $pull: { friends: friendRequest.recipient },
  });
  // add friend to recipient's friends list
  await UserModel.findByIdAndUpdate(friendRequest.recipient, {
    $pull: { friends: friendRequest.sender },
  });
  res.status(200).json("Done");
});

//get posts of friends only

export const friendsPost = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({_id:req.user._id ,isDeleted:false}).populate("friends");
  if (!user) {

    return next(new Error("no User Found From System"));
  }
  const friendList = user.friends.map((friend) => friend._id);
  const cursor = PostModel.find({
    privacy: "friends-only",
    user_Id: { $in: friendList },
    isDeleted:false
  })
    .populate([
      {
        path: "user_Id",
        select: "username image",
      },
      {
        path: "like",
        select: "username image",
      },
      {
        path: "unlike",
        select: "username image",
      },
    ])
    .sort("-createdAt") //descinding post from greater than to lower in total vote
    .cursor();
  // as abad performances because this query is find all posts then calculate comment
  const postList = [];
  // it ia agood performance
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const comment = await CommentModel.find({
      post_Id: doc._id,
      isDeleted:false
    }).populate([
      {
        path: "user_Id",
        select: "username image",
      },
      {
        path: "like",
        select: "username image",
      },
      {
        path: "unlike",
        select: "username image",
      },
    ]);

    postList.push({ post: doc, comment });
  }

  return res.json(postList);
});

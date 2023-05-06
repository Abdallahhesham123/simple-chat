import mongoose, { Schema, model, Types } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      min:[2,"minimum length is 2 char"],
      max:[20,"maximum length is 20 char"],
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    image:{
      type: Object,
      default:{}
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Offline",
      enum: ["Offline", "Online","Blocked"],
    },
    phone: String,
    age: Number,
    isDeleted:{
        type:Boolean,
        default:false
    },    
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin","superadmin"]
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    friends:
    [
      {
        type:mongoose.Types.ObjectId,
         ref:'User'
      }
    ],
    forgetCode:{
      type:Number,
      default:null
    },
    changePasswordTime :{
      type:Date,
    },
    wishUserlist:[{ //for product wish to buy in 
      type:Types.ObjectId,
      ref:"Product",
    }],
    provider:{
      type: String,
      default: "system",
      enum: ["system", "facebook","Google" ,"github"]
    },
    socketId:{
      type: String,
    }
   
  },
  {
    timestamps: true,
  }
);

const userModel =mongoose.models.User || model("User", userSchema);
export default userModel;

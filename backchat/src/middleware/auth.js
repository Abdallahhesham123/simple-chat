import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import UserModel from "./../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { getIo } from "../utils/Socket.js";
dotenv.config()
const {JWT_SECRET_KEY ,BEARER_KEY} = process.env;

export const roles ={
  admin:"admin",
  user:"user",
  superadmin:"superadmin"
}
// console.log(Object.values(roles));
export const AuthUser = (accessRoles=[])=>{
  return asyncHandler( async(req, res, next) => {
    
      const headers = req.headers[`authorization`];
      if(!headers?.startsWith(BEARER_KEY)){
  
        return res.status(404).json({message:"Invalid authorization BarearKey"});
      }
  
  const token = headers.split(BEARER_KEY)[1]
  if(!token){
    return res.status(404).json({message:"Token is Required"});
  
  
  }
  
  const decoded=verifyToken({
  
    token,
    signature:JWT_SECRET_KEY
  })
  
  if(!decoded?.id || !decoded?.isLoggedIn){
    return res.status(404).json({message:"INVALID TOKEN PAYLOAD"});
  
  }
  
  const authUser = await UserModel.findById(decoded.id).select("username email image role changePasswordTime")
  // console.log({changePasswordTime:parseInt(authUser.changePasswordTime?.getTime() / 1000 ), tokenIat:decoded.iat});
  
  if(!authUser){
    return res.status(401).json({message:"you arenot authorized ,Not Register user"});
  
  }
  if(parseInt(authUser.changePasswordTime?.getTime() / 1000 ) > decoded.iat){

    return res.status(400).json({message:"Expire Token"});
  }
  

  // console.log(
  //   authUser
  // );
  if(!accessRoles.includes(authUser.role)){
    return res.status(403).json({message:"unauthorized account to make this order"});

  }
  req.user = authUser
  return next();

  
  })
}

export const SocketAuthUser = async(authorization,accessRoles=[] ,socketId)=>{
 
    
     
      if(!authorization?.startsWith(BEARER_KEY)){
  
        getIo().to(socketId).emit("authenticationError","Invalid authorization BarearKey")
      }
  
  const token = authorization.split(BEARER_KEY)[1]
  if(!token){
    // return res.status(404).json({message:"Token is Required"});
    getIo().to(socketId).emit("authenticationError","Token is Required")
  
  }
  
  const decoded=verifyToken({
  
    token,
    signature:JWT_SECRET_KEY
  })
  
  if(!decoded?.id || !decoded?.isLoggedIn){
    // return res.status(404).json({message:"INVALID TOKEN PAYLOAD"});
    getIo().to(socketId).emit("authenticationError","INVALID TOKEN PAYLOAD")
  }
  
  const authUser = await UserModel.findById(decoded.id).select("username email image role changePasswordTime status")
  // console.log({changePasswordTime:parseInt(authUser.changePasswordTime?.getTime() / 1000 ), tokenIat:decoded.iat});
  
  if(!authUser){
    // return res.status(401).json({message:"you arenot authorized ,Not Register user"});
    getIo().to(socketId).emit("authenticationError","you arenot authorized ,Not Register user")
  }
  if(parseInt(authUser.changePasswordTime?.getTime() / 1000 ) > decoded.iat){

    // return res.status(400).json({message:"Expire Token"});
    getIo().to(socketId).emit("authenticationError","Expire Token")
  }
  
  if(authUser.status == "Blocked"){

    getIo().to(socketId).emit("authenticationError"," Sorry you Are  Blocked ")
  }

  if(!accessRoles.includes(authUser.role)){
    // return res.status(403).json({message:"unauthorized account to make this order"});
    getIo().to(socketId).emit("authenticationError","unauthorized account to make this order")

  }
  return authUser;

  

}

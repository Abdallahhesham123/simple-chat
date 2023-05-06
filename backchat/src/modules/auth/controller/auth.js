import UserModel from "../../../../DB/model/User.model.js";
import verifyModel from "../../../../DB/model/VerificationTokenEmail.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
// import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { generateOtp } from "../../../utils/verification.js";
import transporter from "./../../../../DB/emailConfig.js";
import { customAlphabet, nanoid } from "nanoid";
import axios from 'axios';
import * as queryString from 'querystring';
import cloudinary from "../../../utils/cloudinary.js";
// import { isValidObjectId } from "mongoose";
// import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const { JWT_SECRET_KEY, EMAIL_FROM } = process.env;

export const getAuthModule = (req, res, next) => {
  return res.json({ message: "Auth module" });
};

export const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;

  const checkUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (checkUser) {
    return next(
      new Error("Email Exist Please chose another Email", { cause: 409 })
    );
  }

  //sending mail

  const token = generateToken({ payload: { email }, expiresIn: 60 * 5 });

  const RefreshToken = generateToken({
    payload: { email },
    expiresIn: 60 * 60 * 24,
  });
  const link = `http://localhost:3000/verification-email/${email}`;
  const RefreshLink = `${req.protocol}://${req.headers.host}/auth/verification-email/${RefreshToken}`;
  let OTP = generateOtp();
  // console.log(otp);
  const tokenVerify = hash({ plaintext: OTP });
  // console.log("asd", tokenVerify);

  const newVerification = new verifyModel({
    owner: email,
    token: tokenVerify,
  });

  await newVerification.save();

  // Send Email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome in my Site - Verification Email Link",
    html: `     
    
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">
    
    Please Enter Your pin code In form To verify Your email And Enter Site :  ${OTP}</p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${RefreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
            
             `,
  });
  const customId = customAlphabet('123456789' , 3)

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `user/${customId()}/profilePic` }
    );
    req.body.image = { secure_url, public_id };
  }

  req.body.password = hash({ plaintext: password });
   await UserModel.create(req.body);
  return res.status(200).json({
    message: "Successfully Register Please Checkyour mail before login",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  console.log(req.body);
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });
  if (!user?.confirmEmail === true) {
    return next(
      new Error(
        "you can not access to site without Confirm Email check your mail",
        { cause: 404 }
      )
    );
  }

  if (!user) {
    return next(new Error("Invalid Email or password", { cause: 404 }));
  }

  const checkPassword = compare({
    plaintext: password,
    hashValue: user.password,
  });

  if (!checkPassword) {
    return next(new Error("Invalid Email or password", { cause: 404 }));
  }

  const token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
      role: user.role
    },
    expiresIn: 60 * 60 * 24 * 30,
  });

  user.status = "Online";
  user.save();
  const userSend = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  }).select("image status _id username email status role provider");
  return res
    .status(200)
    .json({ message: "Successfully Logged In", token, result: userSend });
});

export const googleSignIn = asyncHandler(async (req, res, next) => {
  // console.log(req.body);

  const { googleAccessToken } = req.body;
  const client = new OAuth2Client(process.env.CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: googleAccessToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const payloadGoogle = await verify();

  // console.log(payloadGoogle);

  const {email , email_verified , picture ,given_name ,family_name ,name} = payloadGoogle


  if(!email_verified){
    return next(
      new Error(
        "Invalid email",
        { cause: 404 }
      )
    );

  }

  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (user) {
  //login

  if(user.provider != "Google"){
    return next(new Error(`This User Already in system  provider is ${user.provider} `, { cause: 404 }));
  }
    const token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
      role: user.role,
      image :user.image,
      provider: user.provider
    },
    expiresIn: 60 * 60 * 24 * 30,
  });

  user.status = "Online";
  user.save();
  const userSend = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  })
  return res.status(200).json({ message: "Successfully Logged In", token ,result:userSend });
  }

  //signup
const customPasswordId = customAlphabet('0123456789zxcvbndfrtwer' , 9)
  const hashPassword = hash({ plaintext: customPasswordId() });
  await UserModel.create({

    username: name,
    email : email.toLowerCase(),
    image : {
      secure_url : picture
    },
    password : hashPassword,
    confirmEmail :true,
    provider :"Google",
    status:"Online"
  });



  return res.status(200).json({
    message: "Successfully Register Please Checkyour mail before login",
  });



});


export const facebookSignIn = asyncHandler(async (req, res, next) => {
  console.log(req.body);



  const {email, picture  ,name ,signedRequest} = req.body

console.log(email);
  if(!signedRequest){
    return next(
      new Error(
        "Invalid Facebook account",
        { cause: 404 }
      )
    );

  }

  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (user) {
  //login

  if(user.provider != "facebook"){
    return next(new Error(`This User Already in system  provider is ${user.provider} `, { cause: 404 }));
  }
    const token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
      role: user.role,
      image :user.image,
      provider: user.provider
    },
    expiresIn: 60 * 60 * 24 * 30,
  });

  user.status = "Online";
  user.save();
  const userSend = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  })
  return res.status(200).json({ message: "Successfully Logged In", token ,result:userSend });
  }

  //signup
const customPasswordId = customAlphabet('0123456789zxcvbndfrtwer' , 9)
  const hashPassword = hash({ plaintext: customPasswordId() });
  await UserModel.create({

    username: name,
    email : email.toLowerCase(),
    image : {
      secure_url : picture.data.url
    },
    password : hashPassword,
    confirmEmail :true,
    provider :"facebook",
    status:"Online"
  });



  return res.status(200).json({
    message: "Successfully Register Please Checkyour mail before login",
  });



});

export const GithubSignIn = asyncHandler(async (req, res, next) => {
  console.log(req.body);
const {ClientGit_Id,Client_Secret}= process.env
const {code}= req.body;
const { data } = await axios({
  url: 'https://github.com/login/oauth/access_token',
  method: 'GET',
  params: {
    client_id: ClientGit_Id,
    client_secret: Client_Secret,
    code,
  },
});
// console.log(data);
const parsedData = queryString.parse(data);
console.log(parsedData.access_token);

async function getGitHubUserData(access_token) {
  const { data } = await axios({
    url: 'https://api.github.com/user',
    method: 'GET',
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  console.log(data); // 
  return data;
};

const { id, email, name, login, avatar_url } = await getGitHubUserData(parsedData.access_token)

const {access_token}= parsedData
  if(!access_token){
    return next(
      new Error(
        "Invalid Facebook account",
        { cause: 404 }
      )
    );

  }

  const user = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (user) {
  //login

  if(user.provider != "github"){
    return next(new Error(`This User Already in system  provider is ${user.provider} `, { cause: 404 }));
  }
    const token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
      role: user.role,
      image :user.image,
      provider: user.provider
    },
    expiresIn: 60 * 60 * 24 * 30,
  });

  user.status = "Online";
  user.save();
  const userSend = await UserModel.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  })
  return res.status(200).json({ message: "Successfully Logged In", token ,result:userSend });
  }

  //signup
const customPasswordId = customAlphabet('0123456789zxcvbndfrtwer' , 9)
  const hashPassword = hash({ plaintext: customPasswordId() });
  await UserModel.create({

    username:login ,
    email : email.toLowerCase(),
    image : {
      secure_url : avatar_url
    },
    password : hashPassword,
    confirmEmail :true,
    provider :"github",
    status:"Online"
  });



  return res.status(200).json({
    message: "Successfully Register Please Checkyour mail before login",
  });



});




export const resetpassword = asyncHandler(async (req, res, next) => {
  const { oldpassword, password, confirm_pass } = req.body;

  const checkUser = await UserModel.findById(req.user._id);

  if (!checkUser) {
    return next(new Error("This User Isnot Exist in database", { cause: 404 }));
  } else {
    const checkPassword = compare({
      plaintext: oldpassword,
      hashValue: checkUser.password,
    });
    if (!checkPassword) {
      return next(
        new Error("password isnot exist in database", { cause: 404 })
      );
    }
  }
  const passwordHash = hash({ plaintext: password });
  await UserModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      password: passwordHash,
    }
  );
  return res
    .status(200)
    .json({ message: "Congratulation ,Your Password Changed " });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp, email } = req.params;
  // console.log(req.params);
  if (!otp.trim() || !email) {
    return next(
      new Error("Invalid Request Missing Parameters", { cause: 404 })
    );
  }
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    // return res.status(404).json({ message: "Invalid Email or password" });
    return next(new Error("Sorry, UserNot found", { cause: 404 }));
  }

  if (user.confirmEmail === true) {
    return next(new Error("This account is already confirmed", { cause: 404 }));
  }

  const tokenVerifiedModel = await verifyModel.findOne({ owner: email });
  // console.log(tokenVerifiedModel);
  if (!tokenVerifiedModel) {
    return next(
      new Error("This User is not found , Please Check Your Pin code", {
        cause: 404,
      })
    );
  }
  // console.log(tokenVerifiedModel.token);
  const checkTokenVerified = compare({
    plaintext: otp,
    hashValue: tokenVerifiedModel.token,
  });

  if (!checkTokenVerified) {
    return next(
      new Error("This is an error Match Verification", { cause: 404 })
    );
  }

  user.confirmEmail = true;

  await verifyModel.findByIdAndDelete(tokenVerifiedModel._id);
  const token = generateToken({
    payload: {
      id: user._id,
      role: user.role,
      isLoggedIn: true,
    },
    expiresIn: 60 * 30,
  });

  user.status = "Online";
  user.save();

  return res.status(200).json({ message: "this email is verified", token });
});
export const sendingemail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const nanoId = customAlphabet("123456789", 4);
  // const code = Math.floor(Math.random() *(9999- 1000 + 1) + 1000)
  const forgetCode = nanoId();
  const user = await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode },
    { new: true }
  );
  if (user) {
    const secret = user._id + JWT_SECRET_KEY;
    const token = generateToken({
      payload: {
        userID: user._id,
      },
      signature: secret,
      expiresIn: 60 * 60 * 60 * 24,
    });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    // console.log(token);
    // Token expires in 1 hour
    const link = `http://127.0.0.1:3000/reset-password/${token}`;

    // Send Email
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: "abdallah-Blog - Password Reset Link",
      html: `
            
            
            
                    
                  
            <!DOCTYPE html>
            <html>
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
            <style type="text/css">
            body{background-color: #88BDBF;margin: 0px;}
            </style>
            <body style="margin:0px;"> 
            <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
            <tr>
            <td>
            <table border="0" width="100%">
            <tr>
            <td>
            <h1>
                <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
            </h1>
            </td>
            <td>
            <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td>
            <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
            <tr>
            <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
            <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
            </td>
            </tr>
            <tr>
            <td>
            <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
            </td>
            </tr>
            <tr>
            <td>
            <p style="padding:0px 100px;">
            </p>
            </td>
            </tr>
            <tr>
            <td>
            <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Reset Your Password</a>
            </td>
            </tr>

            <tr>
            <td>
            <p  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${forgetCode}</p>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td>
            <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
            <tr>
            <td>
            <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
            </td>
            </tr>
            <tr>
            <td>
            <div style="margin-top:20px;">
        
            <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
            
            <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
            </a>
            
            <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
            </a>
        
            </div>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
            </body>
            </html>
            
            
            `,
    });
    res.status(200).json({
      message: "Password Reset Email Sent... Please Check Your Email",
    });
  } else {
    res.status(404).json({ message: "Email doesn't exists" });
  }
});

export const userPasswordResetGen = async (req, res, next) => {
  const { password, code } = req.body;
  const { token } = req.params;
  // console.log(JWT_SECRET_KEY);

  const user = await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  // const user = await UserModel.findById(id).select("_id password");
  if (!user) return next(new Error("Sorry, UserNot found", { cause: 404 }));

  if (user.forgetCode !== Number(code)) {
    return next(
      new Error("Sorry, Invalid reset Code you send please check", {
        cause: 404,
      })
    );
  }

  const new_secret = user._id + JWT_SECRET_KEY;

  verifyToken({ token, signature: new_secret });

  const checkPassword = compare({
    plaintext: password,
    hashValue: user.password,
  });
  if (!checkPassword) {
    const newHashPassword = hash({ plaintext: password });
    await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        password: newHashPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        forgetCode: null,
        changePasswordTime: Date.now(),
      },
    });
    res.status(200).json({ message: "Password Reset Successfully" });
  } else {
    res.status(409).json({
      message: "This password is the old password please change it if you want",
    });
  }
};
export const verifyRefreshEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmation-email/${token}`;
  const RefreshToken = generateToken({
    payload: {
      email,
    },
    expiresIn: 60 * 60 * 24 * 30,
  });
  const RefreshLink = `${req.protocol}://${req.headers.host}/auth/verification-email/${RefreshToken}`;
  // Send Email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "abdallah-Site - Verification Email Link",
    html: `     
    
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
  
    <tr>
    <td>
    <a href="${RefreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
  
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>
  
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
    
            
            
             `,
  });
  return res.status(200).send("<p>Done Please Check Your mail</p>");
};

export const confirmationEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });
  const user = await UserModel.updateOne(
    { email: email.toLowerCase() },
    { confirmEmail: true }
  );
  return user.modifiedCount
    ? res.status(200).redirect("https://github.com/")
    : res.status(404).send("not register account");
};

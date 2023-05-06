import express from 'express';
import initApp from './src/app.router.js';
import dotenv from 'dotenv'
// import {Server} from "socket.io"
import { InitIo } from './src/utils/Socket.js';
import { SocketAuthUser, roles } from './src/middleware/auth.js';
import userModel from './DB/model/User.model.js';
dotenv.config()

const app = express()

const port = process.env.PORT || 5000

console.log({DB: process.env.URL_DB});


initApp(app, express)
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = InitIo(server)

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  

    socket.on("updatedSocketId", async(data) => {
      const {_id} =await  SocketAuthUser(data.token , Object.values(roles) , socket.id)

      await userModel.updateOne({_id},{socketId:socket.id});
      socket.emit("authenticationError","Done")
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        //   getIo().to(sendUserSocket).emit("msg-recieve", data.msg); //general function
      }
    });
  });
  
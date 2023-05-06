import express from 'express';
import initApp from './src/app.router.js';
import dotenv from 'dotenv'
import {Server} from "socket.io"
dotenv.config()

const app = express()

const port = process.env.PORT || 5000

console.log({DB: process.env.URL_DB});


initApp(app, express)
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
  
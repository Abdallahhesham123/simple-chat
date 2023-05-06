import { Server } from "socket.io";


let io;

export const InitIo= (HttpServer)=>{
   io= new Server(HttpServer, {
        cors: {
          origin: "http://localhost:3000",
          credentials: true,
        },
      });

      return io
}

export const getIo=()=>{
    if(!io){
        throw new Error("Fail to Setup Io");
    }
    return io;
}
import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/Site-components/ChatContainer.jsx";
import Contacts from "../components/Site-components/Contacts.jsx";
import Welcome from "../components/Site-components/Welcome.jsx";
import axios from "axios";
import {  useSelector } from "react-redux";
import { io } from "socket.io-client";

import { host } from "../utils/APIRoutes";
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
const config={
  headers:{
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  }
}
const ChatPage = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const socket = useRef();
  // console.log(socket.current.id);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  useEffect( () => {
 const FetchAllUser = async()=>{

  const {data} = await axios.get(`http://localhost:5000/user` ,config);
  // console.log(data.users);
   setContacts(data.users);
 }
 if(user){
      FetchAllUser();
 }
        
  },[socket?.current?.id ,user]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  useEffect(() => {
    if (user) {
      socket.current = io(host);
      socket.current.emit("add-user", user._id);
      socket.current.emit("updatedSocketId",{token:`Bearer ${localStorage.getItem("token")}`});
      socket.current.on("authenticationError", data => {

     
          console.log(data);
      
      })
    }
  }, [user]);
  return (
    <Container>
    <div className="container">
      <Contacts contacts={contacts}  changeChat={handleChatChange}/>
      {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />

          )}
    </div>
  </Container>
  )
}

export default ChatPage
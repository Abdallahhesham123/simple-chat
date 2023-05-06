import React, { useEffect } from 'react'
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  HomePage,
  ChatPage
} from "./Routes/MainRoutes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendingEmail from './components/Auth/SendingEmail/SendingEmail.jsx';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword.jsx';
import VerifyEmail from './components/Auth/VerifyEmail/VerifyEmail.jsx';
import ProtectedRoute from "./Routes/ProtectetedRoute/PrivateRoute.js";
import Contacts from './components/Site-components/Contacts.jsx';

const App = () => {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={< LoginPage/>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      {/* <Route path="/contacts" element={< Contacts/>} /> */}
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/forget-password" element={<SendingEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword/>} />
      <Route path="/verification-email/:email" element={<VerifyEmail/>} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // theme="colored"
        // toastStyle={{ backgroundColor: "red" }}
      />
      </BrowserRouter>
  )
}

export default App

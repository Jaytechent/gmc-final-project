import React from "react";
import "./App.css";
import './style.css';
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./component/Home";
import Register from "./component/Register";
import Login from "./component/Login";
import CreatePost from "./component/CreatePost";
import ProtectedRoute from "./component/ProtectedRoute";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import About from "./component/About"
import Post from "./pages/Post";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/createpost" element={<CreatePost />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
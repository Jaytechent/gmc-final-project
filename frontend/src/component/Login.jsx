import React, { useState } from "react";
import { Button, Input } from "antd";
import validator from "validator";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const  BASE_URL =   import.meta.env.VITE_BASE_URL

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !validator.isEmail(formData.email) ||
      !validator.isStrongPassword(formData.password)
    ) {
      messageApi.open({
        type: "error",
        content: "Please check your input values",
        style: {
          color: "red",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const loginResponse = await axios.post(
        `${BASE_URL}/api/v1/auth/login`,
        formData
      );
      // console.log(loginResponse);

      // Dispatch the email to the Redux store
      dispatch(updateUser(loginResponse.data ));
      // Navigate to the homepage after successful login
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);

      messageApi.open({
        type: "error",
        content: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
   

    <>
    
   
    <div className="flex flex-col md:flex-row gap-8 p-8">
  <section className="grid place-items-center w-full md:w-1/2 bg-white rounded-md shadow-md">
    {contextHolder}
    <form className="max-w-xl w-full space-y-4">
        <Input onChange={handleUserInput} name="email" placeholder="Email" />
        <Input
          onChange={handleUserInput}
          name="password"
          placeholder="Password"
        />
        <p>
          Don't have an account? <Link to="/register">Register</Link>{" "}
        </p>
        <Button block type="primary" onClick={handleSubmit} loading={loading}>
          LOG IN
        </Button>
<p className="pt-2 text-center align-middle">   <Link to="/forgot-password">Forgot Password?</Link></p>
      
      </form>
    </section>

    <div className="flex-1 relative overflow-hidden bg-white rounded-md shadow-md">
  <video className="w-full h-full object-cover" src="/gmcads-login-vdo.mp4" autoPlay loop muted playsInline></video>
</div>





    </div>
    </>
  );
};

export default Login;

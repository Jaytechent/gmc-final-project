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
        "http://localhost:3000/api/v1/auth/login",
        formData
      );
      // console.log(loginResponse);

      const userName = loginResponse.data.name;

      // Dispatch the email to the Redux store
      dispatch(updateUser({ name: userName }));
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
    <section className="grid place-items-center">
      {contextHolder}
      <form className="max-w-xl w-full space-y-4">
        <Input onChange={handleUserInput} name="email" placeholder="Email" />
        <Input
          onChange={handleUserInput}
          name="password"
          placeholder="Password"
        />
        <p>
          Don't have an account? <Link to="/login">Register</Link>{" "}
        </p>
        <Button block type="primary" onClick={handleSubmit} loading={loading}>
          LOG IN
        </Button>

        <Link to="/forgot-password">Forgot Password?</Link>
      </form>
    </section>
  );
};

export default Login;

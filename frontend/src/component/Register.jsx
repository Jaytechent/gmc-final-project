import React, { useState } from "react";
import { Button, Input } from "antd";
import validator from "validator";
import axios from "axios";
import { message } from "antd";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const navigate = useNavigate();
  const  BASE_URL =   import.meta.env.VITE_BASE_URL
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));

    // Check if the password is alphanumeric with symbols
    if (name === "password") {
      const isValid = validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      });

      setIsPasswordValid(isValid);
    }
  };

  const handleSubmit = async () => {
    if (
      validator.isEmpty(formData.name) ||
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
      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/register`,
        formData
      );
      // console.log(response);

      navigate("/login");
      // window.alert("YOU HAVE SUCCESSFULLY REGISTERED");
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
 <div className="flex flex-col md:flex-row gap-4 p-8">
  <section className="grid place-items-center w-full md:w-1/2 bg-white rounded-md shadow-md">

    <h2>Register</h2>
      {contextHolder}
      <form className="max-w-xl w-full space-y-4">
        <Input onChange={handleUserInput} name="name" placeholder="Name" allowClear />
        <Input onChange={handleUserInput} name="email" placeholder="Email" allowClear />
        <Input.Password
          onChange={handleUserInput}
          name="password"
          placeholder="Password" allowClear
        />
        {!isPasswordValid && (
          <p style={{ color: "red" }}>
            Password must be alphanumeric, symbols and not less than 8 char
          </p>
        )}

        <p>
          Already have an account? <Link to="/login">Login</Link>{" "}
        </p>
        <Button block type="primary" onClick={handleSubmit} loading={loading}>
          Register user
        </Button>
      </form>
    </section>



<div className="flex-1 relative overflow-hidden bg-white rounded-md shadow-md">
  <video className="w-full h-full object-cover" src="/gmcads-reg-vdo.mp4" autoPlay loop muted playsInline></video>
</div>






  </div>
  
  
  
  </>


  );
};

export default Register;

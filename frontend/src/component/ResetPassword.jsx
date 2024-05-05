import React, { useState, useEffect } from "react";
import { Button, Input, message as antMessage } from "antd";
import axios from "axios";
import validator from "validator";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    resetToken: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = antMessage.useMessage();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // Extract email and resetToken from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email") || "";
    const resetToken = searchParams.get("resetToken") || "";

    // Set initial values for email and resetToken
    setFormData((prevValue) => ({
      ...prevValue,
      email,
      resetToken,
    }));
  }, [location.search]);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));

    // Check if the password is alphanumeric with symbols
    if (name === "newPassword") {
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

  const handleResetPassword = async () => {
    const { email, resetToken, newPassword } = formData;

    try {
      setLoading(true);

      if (!isPasswordValid) {
        antMessage.error(
          "Password must be at least 8 characters and include uppercase, lowercase, and a number."
        );
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/reset-password`,
        {
          email,
          resetToken,
          newPassword,
        }
      );

      // Handle response (success or error)
      //   console.log(response);
      // You can redirect the user to a login page or show a success message
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);

      antMessage.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid place-items-center p-16">
      {contextHolder}
      <form className="max-w-xl w-full space-y-4">
        <Input
          onChange={handleUserInput}
          name="email"
          placeholder="Email"
          value={formData.email}
          disabled
        />
        <Input
          onChange={handleUserInput}
          name="resetToken"
          placeholder="Reset Token"
          value={formData.resetToken}
          
        />
        <Input
          onChange={handleUserInput}
          name="newPassword"
          placeholder="New Password"
          type="password"
          allowClear
        />
        {!isPasswordValid && (
          <p style={{ color: "red" }}>
            Password must be alphanumeric, symbols and not less than 8 char
          </p>
        )}
        <Button
          block
          type="primary"
          onClick={handleResetPassword}
          loading={loading}
        >
          RESET PASSWORD
        </Button>
      </form>
    </section>
  );
};

export default ResetPassword;

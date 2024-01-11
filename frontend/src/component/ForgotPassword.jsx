// ForgotPassword.js
import React, { useState } from "react";
import { Button, Input } from "antd";
import axios from "axios";
import { message } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handleSendPasswordReset = async () => {
    try {
      setLoading(true);

      // Check if the email exists on the server
      const emailCheckResponse = await axios.post(
        "http://localhost:3000/api/v1/auth/check-email",
        { email }
      );

      if (emailCheckResponse.data.exists) {
        // If the email exists, send a password reset link
        const resetPasswordResponse = await axios.post(
          "http://localhost:3000/api/v1/auth/reset-password",
          { email }
        );

        message.success(resetPasswordResponse.data.message);
      } else {
        // If the email doesn't exist, show an error
        message.error("Email not found. Please register.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      message.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center">
      <form className="max-w-xl w-full space-y-4">
        <Input
          onChange={handleEmailInput}
          name="email"
          placeholder="Enter your email"
        />
        <Button
          block
          type="primary"
          onClick={handleSendPasswordReset}
          loading={loading}
        >
          Send Password Reset Email
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;

// ForgotPassword.js
import React, { useState } from "react";
import { Button, Input } from "antd";
import axios from "axios";
import { message } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const  BASE_URL =   import.meta.env.VITE_BASE_URL

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handleSendPasswordReset = async () => {
    try {
      setLoading(true);

      // Check if the email exists on the server
      const emailCheckResponse = await axios.post(
        `${BASE_URL}/api/v1/auth/generate-reset-token`,
        { email }
      );


        message.success(emailCheckResponse.data.message);
   
      
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
    <div className="grid place-items-center p-16">
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

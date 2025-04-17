import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/forgotpassword", data);
      if (res.status === 200) {
        alert("Password reset link sent to your email.");
        navigate("/login");
      }
    } catch (error) {
      alert("Failed to send reset link. Please try again.");
      console.error(error);
    }
  };

  const validationSchema = {
    emailValidator: {
      required: {
        value: true,
        message: "Email is required"
      },
      pattern: {
        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Enter a valid email address"
      }
    }
  };

  return (
    <div className="forgetpassword">
      <div className="login-card">
        <div className="brand">
          <h1>Forgot Password</h1>
          <p>We'll send a password reset link to your email</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              {...register("email", validationSchema.emailValidator)}
            />
            <span className="error">
              {errors.email?.message}
            </span>
          </div>

          <button type="submit" className="login-btn">
            Send Reset Link
          </button>
        </form>

        <div className="signup-link">
          <p>
            Remembered your password? <a href="/login">Go to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};
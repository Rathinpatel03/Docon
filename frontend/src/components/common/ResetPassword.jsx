import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const submitHandler = async (data) => {
    const obj = {
      token: token,
      password: data.password
    };

    try {
      const res = await axios.post("/user/resetpassword", obj);
      if (res.status === 200) {
        alert("Password reset successfully.");
        navigate("/login");
      }
    } catch (err) {
      alert("Error resetting password.");
      console.error(err);
    }
  };

  return (
    <div className="resetpassword">
      <div className="login-card">
        <div className="brand">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            <span className="error">{errors.password?.message}</span>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match"
              })}
            />
            <span className="error">{errors.confirmPassword?.message}</span>
          </div>

          <button type="submit" className="login-btn">
            Reset Password
          </button>
        </form>

        <div className="signup-link">
          <p>
            Back to <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};
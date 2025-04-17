import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import "../../assets/css/login.css";

export const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);

      if (res.status === 200) {
        toast.success("Login Success"); // Success toast
        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);
        localStorage.setItem("email", res.data.data.email);

        if (res.data.data.roleId.name === "USER") {
          navigate("/user");
        } else if (res.data.data.roleId.name === "DOCTOR") {
          navigate("/doctor");
        } else if (res.data.data.roleId.name === "ADMIN") {
          navigate("/admin");
        }
      }
    } catch (err) {
      toast.error("Login Failed: " + err.response?.data?.message || "Unknown error"); // Error toast
    }
  }

  const validationSchema = {
    emailValidator: {
      required: {
        value: true,
        message: "Email is required"
      }
    },
    passwordValidator: {
      required: {
        value: true,
        message: "Password is required"
      }
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        <div className="brand">
          <h1>LOGIN USER</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type='text'
              placeholder='Enter email'
              {...register("email", validationSchema.emailValidator)}
            />
            <span style={{ color: "red" }}>
              {errors.email?.message}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type='password'
              placeholder='Enter password'
              {...register("password", validationSchema.passwordValidator)}
            />
            <span style={{ color: "red" }}>
              {errors.password?.message}
            </span>
          </div>
          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <a href="forgetpassword" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="signup-link">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../assets/css/signup.css";

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Patient");

  const roleIds = {
    Patient: "68006be8b6309ac6a6071303",
    Doctor: "68006c13b6309ac6a6071307",
    Admin: "68006bfbb6309ac6a6071305"
  };

  const submitHandler = async (data) => {
    data.roleId = roleIds[selectedRole];

    try {
      const res = await axios.post("/user", data);
      if (res.status === 201) {
        alert("User created successfully");
        navigate("/login");
      } else {
        alert("User not created");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  const validationSchema = {
    emailValidator: {
      required: { value: true, message: "Email is required" }
    },
    passwordValidator: {
      required: { value: true, message: "Password is required*" }
    },
    firstnameValidator: {
      required: { value: true, message: "First name is required*" }
    },
    lastnameValidator: {
      required: { value: true, message: "Last name is required*" }
    },
    ageValidator: {
      required: { value: true, message: "Age is required" },
      min: { value: 18, message: "Min age is 18*" },
      max: { value: 60, message: "Max age is 60*" }
    }
  };

  const roleStyle = {
    container: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
      gap: "10px",
    },
    button: (role) => ({
      padding: "8px 16px",
      borderRadius: "20px",
      border: selectedRole === role ? "2px solid #6A1B9A" : "1px solid #ccc",
      backgroundColor: selectedRole === role ? "#6A1B9A" : "#fff",
      color: selectedRole === role ? "#fff" : "#6A1B9A",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "bold",
    })
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="brand">
          <h1>REGISTER</h1>
          <p>Register as {selectedRole}</p>
        </div>

        {/* Styled Role Toggle */}
        <div style={roleStyle.container}>
          {["Patient", "Doctor", "Admin"].map((role) => (
            <button
              key={role}
              style={roleStyle.button(role)}
              onClick={() => setSelectedRole(role)}
              type="button"
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" {...register("firstName", validationSchema.firstnameValidator)} placeholder="Enter first name" />
            <span style={{ color: "red" }}>{errors.firstname?.message}</span>
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" {...register("lastName", validationSchema.lastnameValidator)} placeholder="Enter last name" />
            <span style={{ color: "red" }}>{errors.lastname?.message}</span>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="text" {...register("age", validationSchema.ageValidator)} placeholder="Enter age" />
            <span style={{ color: "red" }}>{errors.age?.message}</span>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register("email", validationSchema.emailValidator)} placeholder="Enter email" />
            <span style={{ color: "red" }}>{errors.email?.message}</span>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" {...register("password", validationSchema.passwordValidator)} placeholder="Enter password" />
            <span style={{ color: "red" }}>{errors.password?.message}</span>
          </div>

          <button type="submit" className="signup-btn">Register</button>
        </form>

        <div className="signup-link">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};
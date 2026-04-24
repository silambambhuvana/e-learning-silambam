import React, { useState } from "react";
import "./RegisterPage.css";
import logo from "../assets/logo.jpeg";
import axios from "axios";

function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ✅ Password check
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/app1/register/", {
        name: name,
        email: email,
        password: password
      });
      setName("");
      setEmail("");
      setPassword("")
      setConfirmPassword("")
      alert("Registered successfully");
      

      // 🔄 Redirect to login
      window.location.href = "/login";

    } catch (err) {
  if (err.response && err.response.data.error) {
    alert(err.response.data.error);  // 🔥 shows real backend message
  } else {
    alert("Registration failed");
  }
}

  setLoading(true);
  };

  return (
    <div className="register-container">
    
      <div className="register-card">

        <img src={logo} alt="logo" className="register-logo"/>

        <h2>Create Your Account</h2>

        {/* 🔥 Added onSubmit */}
        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              onChange={(e)=>setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter password"
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm password"
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="register-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>

        </form>

      </div>

    </div>
  );
}

export default RegisterPage;
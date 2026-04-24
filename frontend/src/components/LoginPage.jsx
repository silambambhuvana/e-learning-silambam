import "./LoginPage.css"
import logo from "../assets/logo.jpeg"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function LoginPage() 
{ 
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://127.0.0.1:8000/app1/login/", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("name", res.data.name); 

    setEmail("");
    setPassword("");
    console.log("ROLE FROM BACKEND:", res.data.role);

    const role = res.data.role?.toLowerCase().trim();


    if (role === "admin") {
     window.location.href = "/admin";
} 
    else if (role === "student") {
     navigate("/student");
} 
    else if (role === "instructor") {
     window.location.href = "/instructor";
} 
    else {
       alert("Not registered?");
}

  } catch {
    alert("Invalid credentials");
  }
};

  return (
    <div className="login-container">

      <div className="login-card">

        <img src={logo} alt="logo" className="login-logo"/>

        <h2>Member Login</h2>

        {/* 🔥 Added onSubmit */}
        <form onSubmit={handleLogin} autoComplete="off">

          <div className="form-group">
            <label>Email</label>
            <input 
              name="user_email" 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              name="user_password" 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button className="login-btn">Login</button>

          <p className="forgot">Forgot password?</p>

          <p className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>

        </form>

      </div>

    </div>
  )
}

export default LoginPage;
import { useState,useEffect } from "react";
import api from "../api";

function CreateInstructor() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none"
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#2b4a8b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "0.3s"
};
useEffect(() => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    window.location.href = "/login";
  }
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError(""); // clear old error

  try {
    await api.post("create_instructor/", {
      name,
      email,
      password
    });

    alert("Instructor created successfully");
    window.location.href = "/manage-instructors";

  } catch (err) {
    if (err.response && err.response.data.error) {
      setError(err.response.data.error);  // ✅ show backend error
    } else {
      setError("Error creating instructor");
    }
  }
};

  return (
    <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#f4f7fb,#e8f0ff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2b4a8b", marginBottom: "20px" }}>
        Create Instructor
      </h2>

      <form onSubmit={handleSubmit} autoComplete="off">

        <input 
          name="instructor_name"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
          style={inputStyle}
        /><br/><br/>

        <input 
  name="instructor_email"
  placeholder="Email"
  value={email}
  onChange={(e)=>{
    setEmail(e.target.value);
    setError(""); // clear error while typing
  }}
  required
  style={inputStyle}
/>

{error && (
  <p style={{ color: "red", fontSize: "13px" }}>
    {error}
  </p>
)}<br/><br/>

        <input 
        name="instructor_password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          style={inputStyle}
        /><br/><br/>

        <button type="submit" style={btnStyle}>Create Instructor</button>

      </form>

    </div>
    </div>
  );
}

export default CreateInstructor;
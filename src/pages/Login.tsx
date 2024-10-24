import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@example.com" && password === "admin@123") {
      localStorage.setItem("isAdmin", "true"); 
      navigate("/admin"); 
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <h2>Login</h2>
		<form onSubmit={handleLogin} style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',gap:10}}>
			<input type="email" placeholder="Email" value={email}
				onChange={(e) => setEmail(e.target.value)}/>
			<input type="password" placeholder="Password" value={password}
				onChange={(e) => setPassword(e.target.value)}/>
			<Button type="submit">Login</Button>
		</form>
    </>
  );
};

export default Login;

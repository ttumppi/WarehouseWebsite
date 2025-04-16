import React, { useState } from "react";
import CryptoJS from "crypto-js";

const Login = ({ loginSuccessfull, changePassword}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      
      const saltRes = await fetch(
        `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/login/${username}`);
      const saltData = await saltRes.json();

      if (!saltData.success) {
        setMessage(saltData.message);
        return;
      }

      const salt = saltData.salt;

     
      const combined = password + salt;
      const hash = CryptoJS.SHA256(combined).toString();
      
      const loginRes = await fetch(
        `http://ec2-54-204-100-237.compute-1.amazonaws.com:5000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password: hash }),
      });

      const loginData = await loginRes.json();

      

      if (loginData.success) {

        if (loginData.role.includes("(F)")){
          changePassword(username);
          return;
        }

        setMessage(`Welcome, ${loginData.username}`);
        loginSuccessfull(loginData.username, loginData.role);


      } else {
        setMessage("Login failed");
      }


    } catch (err) {
      console.error(err);
      setMessage("Error during login");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;

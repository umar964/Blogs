 

import React, { useState } from "react";
import axios from "axios";
import "./CreateAdmin.css"; // Import CSS file

function CreateAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/create-admin", {
        name,
        email,
        password
      });
      setMessage(res.data.msg);
    } catch (error) {
      setMessage("Error: " + error.response.data.error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Create Admin</h2>
      <form onSubmit={handleCreateAdmin} className="admin-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="admin-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="admin-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="admin-input"
        />
        <button type="submit" className="admin-button">Create Admin</button>
      </form>
      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}

export default CreateAdmin;


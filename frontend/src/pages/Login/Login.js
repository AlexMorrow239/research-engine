import React, { useState } from "react";

const LoginPage = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [certifications, setCertifications] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login validation
    if (email && name) {
      onSuccess(); // Notify the parent component of successful login
    } else {
      alert("Please fill in the required fields.");
    }
  };

  return (
    <div className="login-moddal-final">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-supl">
          <label>Your Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-supl">
          <label>Your Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="login-supl">
          <label>Grade</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <div className="login-supl">
          <label>Certifications</label>
          <input
            type="text"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            placeholder="e.g., volunteer number, CPR certification, etc."
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>or</p>
        <button>Register New Account</button>
      </div>
    </div>
  );
};

export default LoginPage;

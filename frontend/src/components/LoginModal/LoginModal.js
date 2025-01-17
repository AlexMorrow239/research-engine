import React from "react";

function LoginModal() {
  // Placeholder for the "Register New Account" action
  const handleRegisterNewAccount = () => {
    alert("Register New Account functionality is coming soon!");
  };

  return (
    <div className="login-modal">
      <h2>Faculty Login</h2>
      <form className="login-form">
        <label>
          Your Email *
          <input type="email" placeholder="Email" required />
        </label>
        <label>
          Your Name *
          <input type="text" placeholder="Your Name" required />
        </label>
        <label>
          Grade
          <input type="text" placeholder="If applicable, grade level" />
        </label>
        <label>
          Certifications
          <input type="text" placeholder="e.g., volunteer number, CPR certification, etc." />
        </label>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p>
        <button type="submit" onClick={handleRegisterNewAccount} className="new-account-button">
          Register New Account
        </button>
      </p>
    </div>
  );
}

export default LoginModal;

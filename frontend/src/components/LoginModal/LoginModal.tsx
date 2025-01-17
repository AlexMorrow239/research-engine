import React, { useState } from "react";
import "./LoginModal.scss";

interface LoginFormData {
  email: string;
  name: string;
  grade?: string;
  certifications?: string;
}

const LoginModal: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    name: "",
    grade: "",
    certifications: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Form submitted:", formData);
  };

  const handleRegisterNewAccount = () => {
    alert("Register New Account functionality is coming soon!");
  };

  return (
    <div className="login-modal">
      <h2 className="login-modal__title">Faculty Login</h2>
      
      <form className="login-modal__form" onSubmit={handleSubmit}>
        <div className="login-modal__field">
          <label className="login-modal__label">
            Your Email *
            <input
              type="email"
              name="email"
              className="login-modal__input"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              aria-required="true"
            />
          </label>
        </div>

        <div className="login-modal__field">
          <label className="login-modal__label">
            Your Name *
            <input
              type="text"
              name="name"
              className="login-modal__input"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              aria-required="true"
            />
          </label>
        </div>

        <div className="login-modal__field">
          <label className="login-modal__label">
            Grade
            <input
              type="text"
              name="grade"
              className="login-modal__input"
              placeholder="If applicable, grade level"
              value={formData.grade}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="login-modal__field">
          <label className="login-modal__label">
            Certifications
            <input
              type="text"
              name="certifications"
              className="login-modal__input"
              placeholder="e.g., volunteer number, CPR certification, etc."
              value={formData.certifications}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <button type="submit" className="login-modal__submit">
          Login
        </button>
      </form>

      <div className="login-modal__register">
        <button
          type="button"
          onClick={handleRegisterNewAccount}
          className="login-modal__register-button"
        >
          Register New Account
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
import React, { useState } from "react";
import "./Login.scss";

interface LoginProps {
  onSuccess: () => void;
}

interface LoginFormData {
  email: string;
  name: string;
  grade: string;
  certifications: string;
}

const LoginPage: React.FC<LoginProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    name: "",
    grade: "",
    certifications: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login validation
    if (formData.email && formData.name) {
      onSuccess();
    } else {
      alert("Please fill in the required fields.");
    }
  };

  return (
    <div className="login">
      <h2 className="login__title">Login</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__form-group">
          <label className="login__label">
            Your Email *
            <input
              className="login__input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="login__form-group">
          <label className="login__label">
            Your Name *
            <input
              className="login__input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="login__form-group">
          <label className="login__label">
            Grade
            <input
              className="login__input"
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="login__form-group">
          <label className="login__label">
            Certifications
            <input
              className="login__input"
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="e.g., volunteer number, CPR certification, etc."
            />
          </label>
        </div>

        <button type="submit" className="login__submit">
          Login
        </button>
      </form>

      <div className="login__divider">
        <span className="login__divider-text">or</span>
      </div>

      <button className="login__register">
        Register New Account
      </button>
    </div>
  );
};

export default LoginPage;
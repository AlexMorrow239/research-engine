import { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginUser } from "@/store/features/auth/authSlice";

import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { useAppDispatch, useAppSelector } from "@/store";

import "./FacultyLogin.scss";

// Define the form validation schema
const facultyLoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/.+@.*miami\.edu$/i, "Must be a valid Miami.edu email address"),
  password: z.string().min(1, "Password is required"),
});

type FacultyLoginForm = z.infer<typeof facultyLoginSchema>;

export default function FacultyLogin(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  const form = useForm<FacultyLoginForm>({
    resolver: zodResolver(facultyLoginSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: FacultyLoginForm): Promise<void> => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();

      if (result.accessToken) {
        navigate("/faculty/dashboard");
      }
    } catch (err) {
      // The auth slice and API will handle the error toast
      console.error("Login error:", err);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/faculty/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="faculty-login">
      <div className="faculty-login__container">
        <h1 className="faculty-login__title">Faculty Login</h1>
        <p className="faculty-login__subtitle">
          Sign in to manage your research opportunities
        </p>

        <form
          className="faculty-login__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-section">
            <FormField
              formType="generic"
              form={form}
              name="email"
              label="Miami Email Address"
              type="email"
              placeholder="username@miami.edu"
            />

            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="button button--primary button--full-width"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="faculty-login__footer">
            <p>
              Don't have an account?{" "}
              <Link to="/faculty/register">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

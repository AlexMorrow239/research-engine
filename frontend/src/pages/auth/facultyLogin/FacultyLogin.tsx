import { useAppDispatch, useAppSelector } from "@/store";
import { loginUser } from "@/store/features/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FacultyLoginForm>({
    resolver: zodResolver(facultyLoginSchema),
    mode: "onChange",
  });

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
            <div className="form-group">
              <label htmlFor="email">Miami Email Address</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={errors.email ? "error" : ""}
                placeholder="username@miami.edu"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="button button--primary button--full-width"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <p className="faculty-login__footer">
            Don't have an account? <a href="/faculty/register">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

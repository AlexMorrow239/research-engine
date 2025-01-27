import { useAppDispatch } from "@/store";
import {
  requestPasswordReset,
  resetPassword,
} from "@/store/features/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import "./ResetPassword.scss";

// Form validation schemas
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must include uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RequestResetForm = z.infer<typeof requestResetSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Form for requesting password reset
  const requestForm = useForm<RequestResetForm>({
    resolver: zodResolver(requestResetSchema),
  });

  // Form for setting new password
  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Handle requesting password reset
  const handleRequestReset = async (data: RequestResetForm): Promise<void> => {
    try {
      setIsLoading(true);
      await dispatch(requestPasswordReset(data.email)).unwrap();
      setRequestSent(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setting new password
  const handleResetPassword = async (
    data: ResetPasswordForm
  ): Promise<void> => {
    if (!token) return;

    try {
      setIsLoading(true);
      await dispatch(
        resetPassword({ token, password: data.password })
      ).unwrap();
      navigate("/faculty/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password__container">
        <h1 className="reset-password__title">Reset Password</h1>

        {!token ? (
          // Request Reset Form
          <form
            className="reset-password__form"
            onSubmit={requestForm.handleSubmit(handleRequestReset)}
          >
            {!requestSent ? (
              <>
                <p className="reset-password__description">
                  Enter your email address and we'll send you instructions to
                  reset your password.
                </p>
                <div className="form-field">
                  <label htmlFor="email" className="form-field__label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-field__input ${
                      requestForm.formState.errors.email
                        ? "form-field__input--error"
                        : ""
                    }`}
                    {...requestForm.register("email")}
                  />
                  {requestForm.formState.errors.email && (
                    <span className="form-field__error">
                      {requestForm.formState.errors.email.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="button button--primary button--full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </button>
              </>
            ) : (
              <div className="reset-password__success">
                <p>
                  If an account exists with that email address, we've sent
                  instructions to reset your password.
                </p>
                <p>Please check your email and follow the link provided.</p>
              </div>
            )}
          </form>
        ) : (
          // Reset Password Form
          <form
            className="reset-password__form"
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
          >
            <p className="reset-password__description">
              Please enter your new password below.
            </p>
            <div className="form-field">
              <label htmlFor="password" className="form-field__label">
                New Password
              </label>
              <input
                id="password"
                type="password"
                className={`form-field__input ${
                  resetForm.formState.errors.password
                    ? "form-field__input--error"
                    : ""
                }`}
                {...resetForm.register("password")}
              />
              {resetForm.formState.errors.password && (
                <span className="form-field__error">
                  {resetForm.formState.errors.password.message}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-field__label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`form-field__input ${
                  resetForm.formState.errors.confirmPassword
                    ? "form-field__input--error"
                    : ""
                }`}
                {...resetForm.register("confirmPassword")}
              />
              {resetForm.formState.errors.confirmPassword && (
                <span className="form-field__error">
                  {resetForm.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="button button--primary button--full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="reset-password__footer">
          <button
            type="button"
            className="button button--link"
            onClick={() => navigate("faculty/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

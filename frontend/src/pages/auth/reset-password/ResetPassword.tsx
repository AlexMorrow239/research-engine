import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  requestPasswordReset,
  resetPassword,
} from "@/store/features/auth/authSlice";

import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  PasswordResetForm,
  PasswordResetRequestForm,
  passwordResetRequestSchema,
  passwordResetSchema,
} from "@/validation/authValidator";

import "./ResetPassword.scss";

export const ResetPassword = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [requestSent, setRequestSent] = useState(false);

  // Form for requesting password reset
  const requestForm = useForm<PasswordResetRequestForm>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  // Form for setting new password
  const resetForm = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
  });

  // Handle requesting password reset
  const handleRequestReset = async (
    data: PasswordResetRequestForm
  ): Promise<void> => {
    try {
      await dispatch(requestPasswordReset(data.email)).unwrap();
      setRequestSent(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
    }
  };

  // Handle setting new password
  const handleResetPassword = async (
    data: PasswordResetForm
  ): Promise<void> => {
    if (!token) return;

    try {
      await dispatch(
        resetPassword({ token, password: data.password })
      ).unwrap();
      navigate("/faculty/login");
    } catch (error) {
      console.error("Error resetting password:", error);
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
                <FormField
                  formType="generic"
                  label="Email Address"
                  name="email"
                  type="email"
                  form={requestForm}
                />
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
            <PasswordField
              form={resetForm}
              name="password"
              label="New Password"
              placeholder="Enter your new password"
            />
            <PasswordField
              form={resetForm}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your new password"
            />
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
            onClick={() => navigate("/faculty/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

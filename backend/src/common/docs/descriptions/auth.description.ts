export const AuthDescriptions = {
  login: {
    summary: 'Professor Authentication',
    description: `
      Authenticate a professor using their credentials.
      
      Authentication Process:
      1. Submit email and password
      2. On successful login, you'll receive:
         - An access token
         - Professor profile information
      3. Click the 'Authorize' button at the top
      4. Enter 'Bearer <your_token>' in the value field
      5. You can now access protected endpoints
      
      Note: 
      - Tokens expire after 24 hours and will need to be renewed
      - Only active accounts can log in
    `,
  },
  register: {
    summary: 'Professor Registration',
    description: `
      Register a new professor account.
      
      Registration Process:
      1. Submit registration details including:
         - Email
         - Password
         - Name
         - Department
         - Title
      2. On successful registration, you'll receive:
         - An access token
         - Professor profile information
      3. You can immediately use this token to access protected endpoints
    `,
  },
  responses: {
    loginSuccess: 'Authentication successful. Use the returned token for subsequent requests.',
    invalidCredentials: 'The provided email or password is incorrect.',
    inactiveAccount: 'This account has been deactivated. Please contact administration.',
    serverError: 'An unexpected error occurred during authentication.',
    registrationSuccess: 'Registration successful. Use the returned token for subsequent requests.',
    registrationError: 'Registration failed. Please check your input and try again.',
    invalidAdminPassword:
      'Invalid administrator password. Please contact your department administrator.',
    forgotPasswordSuccess: 'If account exists, reset instructions will be sent to email',
    resetPasswordSuccess: 'Password successfully reset',
    invalidResetToken: 'Invalid or expired reset token',
    invalidPasswordFormat: 'New password does not meet security requirements',
  },
  forgotPassword: {
    summary: 'Request Password Reset',
    description: `
      Request a password reset email.
      
      Process:
      1. Submit miami.edu email address
      2. If account exists, a reset token will be emailed
      3. Token expires after 1 hour
      4. Use token with reset-password endpoint
      
      Note: 
      - For security, the endpoint returns success regardless of email existence
      - Only miami.edu email addresses are accepted
    `,
  },

  resetPassword: {
    summary: 'Reset Password',
    description: `
      Reset password using token received via email.
      
      Requirements:
      1. Valid reset token (from email)
      2. New password meeting strength requirements:
         - Minimum 8 characters
         - At least one uppercase letter
         - At least one lowercase letter
         - At least one number
         - At least one special character
      
      Note:
      - Token expires after 1 hour
      - Previous password will be invalidated
    `,
  },
};

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
  },
};

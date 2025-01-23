/**
 * Examples of authentication requests for API documentation
 */
export const loginExamples = {
  valid: {
    summary: 'Valid Login Credentials',
    description: 'Example of a valid login request',
    value: {
      email: 'professor.test@example.com',
      password: 'SecurePass123!',
    },
  },
  invalidFormat: {
    summary: 'Invalid Format',
    description: 'Example of login attempt with invalid data format',
    value: {
      email: 'not-an-email',
      password: '',
    },
  },
  deactivatedAccount: {
    summary: 'Deactivated Account',
    description: 'Example of login attempt with a deactivated account',
    value: {
      email: 'inactive.professor@example.com',
      password: 'SecurePass123!',
    },
  },
};

export const registerExamples = {
  valid: {
    summary: 'Valid Registration',
    description: 'Example of a valid professor registration request',
    value: {
      email: 'new.professor@example.com',
      password: 'SecurePass123!',
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      department: 'Computer Science',
      title: 'Associate Professor',
    },
  },
  invalidFormat: {
    summary: 'Invalid Format',
    description: 'Example of registration attempt with invalid data format',
    value: {
      email: 'invalid-email',
      password: '123', // Too short
      name: {
        firstName: '',
        lastName: '',
      },
      department: '',
      title: '',
    },
  },
};

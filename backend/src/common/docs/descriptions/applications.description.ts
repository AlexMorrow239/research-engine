export const ApplicationDescriptions = {
  create: {
    summary: 'Submit new application',
    description: `
      Submit a new application for a research project.
      
      Requirements:
      - Application data must be sent as JSON string in 'application' field
      - Resume must be a PDF file under 5MB in 'resume' field
      - All required fields in studentInfo must be filled
      - Valid availability schedule must be provided
      - Additional information must be complete
      
      File Upload Rules:
      - Only PDF files accepted
      - Maximum file size: 5MB
      - File will be stored securely
      
      Note: Use multipart/form-data content type for this request.
    `,
  },
  responses: {
    created: 'Application successfully submitted',
    invalidData: 'Invalid application data or resume file',
    unauthorized: 'Authentication required',
    projectNotFound: 'Project not found or not accepting applications',
    fileRequired: 'Resume file is required',
    invalidFile: 'Invalid file format or size',
  },
};

export const applicationSwaggerFileSchema = {
  type: 'object',
  required: ['application', 'resume'],
  properties: {
    application: { type: 'object', $ref: '#/components/schemas/CreateApplicationDto' },
    resume: {
      type: 'string',
      format: 'binary',
      description: 'Resume file (PDF, DOC, or DOCX)',
    },
  },
};

export const applicationResumeResponseContent = {
  'application/pdf': {},
  'application/msword': {},
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {},
};

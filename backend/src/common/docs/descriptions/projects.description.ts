export const ProjectDescriptions = {
  create: {
    summary: 'Create a new research project',
    description: `
      Create a new research project with the following requirements:
      - Must be authenticated as a professor
      - Title and description are required
      - Campus must be specified
      - At least one research category must be specified
      - Project status defaults to PUBLISHED
      - Number of positions must be specified
      - Application deadline is optional
      
      Notes:
      - Published projects are visible to all users
      - Research categories help students find relevant projects
      - Requirements should be specific and clear
      - Project is automatically linked to creating professor
    `,
  },
  findAll: {
    summary: 'Find all research projects',
    description: `
      Retrieve a paginated list of research projects with optional filters:
      - Page and limit for pagination (default: page 1, limit 10)
      - Department filter (comma-separated departments)
      - Campus filter (single campus)
      - Text search in title and description
      - Research categories filter (array)
      - Sort options: createdAt or applicationDeadline
      - Sort order: asc or desc (default: desc)
      
      Additional Features:
      - Only published and visible projects are returned
      - Department filter matches professor's department
      - Search is case-insensitive and supports partial matches
      - Returns total count for pagination
    `,
  },
  findProfessorProjects: {
    summary: "Find professor's projects",
    description: `
      Retrieve all projects created by the authenticated professor.
      
      Features:
      - Optional filter by project status (DRAFT, PUBLISHED, CLOSED)
      - Returns all projects without pagination
      - Sorted by creation date (newest first)
      - Includes full project details
      - Requires professor authentication
    `,
  },
  findOne: {
    summary: 'Find project by ID',
    description: `
      Retrieve detailed information about a specific project including:
      - Project details and requirements
      - Professor information (name, email, department)
      - Research categories
      - Project status
      - Number of positions
      - Application deadline
      - Visibility status
      
      Notes:
      - Throws NotFoundException if project doesn't exist
      - Returns transformed project response
    `,
  },
  update: {
    summary: 'Update project',
    description: `
      Update an existing project. Only the project owner can perform updates.
      
      Update Rules:
      - All fields are optional - only provided fields will be updated
      - Cannot modify professor ownership
      - Must be project owner to update
      - Returns updated project details
      
      Notes:
      - Throws NotFoundException if project doesn't exist or unauthorized
      - Updates are validated against UpdateProjectDto
    `,
  },
  remove: {
    summary: 'Delete project',
    description: `
      Permanently delete a project. Only the project owner can delete their projects.
      
      Deletion Process:
      - Requires professor authentication
      - Must be project owner
      - Project data completely removed
      - Returns no content on success
      
      Notes:
      - Throws NotFoundException if project doesn't exist or unauthorized
      - File cleanup not yet implemented
    `,
  },
  uploadFile: {
    summary: 'Upload project file',
    description: `
      Upload a file attachment for the project (placeholder implementation).
      
      File Requirements:
      - Maximum file size: 5MB
      - Allowed file types: PDF, DOC, DOCX
      - Only project owner can upload files
      
      Note: File storage functionality is not yet implemented
    `,
  },
  deleteFile: {
    summary: 'Delete project file',
    description: `
      Remove a file attachment from the project (placeholder implementation).
      
      Rules:
      - Only project owner can delete files
      - Filename must be provided
      
      Note: File storage functionality is not yet implemented
    `,
  },
  closeProject: {
    summary: 'Close project',
    description: `
      Close a project and notify all pending applicants.
      
      Process:
      - Sets project status to CLOSED
      - Makes project invisible
      - Updates all pending applications
      - Sends email notifications to applicants
      
      Notes:
      - Only project owner can close their project
      - Cannot be undone
      - Throws NotFoundException if project doesn't exist or unauthorized
    `,
  },
  responses: {
    // Success Responses
    created: 'Project successfully created',
    retrieved: 'Project(s) successfully retrieved',
    updated: 'Project successfully updated',
    deleted: 'Project successfully deleted',
    fileUploaded: 'File upload acknowledged (placeholder)',
    fileDeleted: 'File deletion acknowledged (placeholder)',
    closed: 'Project closed and applicants notified',

    // Error Responses
    notFound: "Project not found or you don't have permission to access it",
    unauthorized: "You don't have permission to perform this action",
    invalidData: 'Invalid project data provided',
    invalidFile: 'Invalid file type or size',
    serverError: 'An unexpected error occurred while processing the request',
  },
};

import { Campus, ProjectStatus } from '@/common/enums';

import { dateUtils } from '../utils/api-docs.utils';

export const createProjectExamples = {
  complete: {
    summary: 'Complete Project Creation',
    description: 'Example of creating a project with all available fields',
    value: {
      title: 'Machine Learning Research Assistant',
      description:
        'Seeking motivated research assistants for an exciting ML project focusing on computer vision and deep learning applications in healthcare. The project involves developing novel algorithms for medical image analysis using state-of-the-art deep learning techniques.',
      researchCategories: [
        'Machine Learning',
        'Computer Vision',
        'Healthcare',
        'Deep Learning',
      ],
      campus: Campus.CORAL_GABLES,
      requirements: [
        'Strong programming skills in Python',
        'Experience with PyTorch or TensorFlow',
        'Background in linear algebra and statistics',
        'Familiarity with computer vision concepts',
        'Ability to work 15-20 hours per week',
      ],
      status: ProjectStatus.PUBLISHED,
      positions: 2,
      applicationDeadline: dateUtils.getFutureDate(3),
    },
  },
  minimal: {
    summary: 'Minimal Project Creation',
    description: 'Example of creating a project with only required fields',
    value: {
      title: 'Research Assistant Needed',
      description:
        'Seeking assistance for ongoing research project in computer science.',
      researchCategories: ['Computer Science'],
      campus: Campus.CORAL_GABLES,
      requirements: ['Programming experience'],
      positions: 1,
    },
  },
  draft: {
    summary: 'Draft Project Creation',
    description: 'Example of creating a project in draft status',
    value: {
      title: 'Data Science Research Project (Draft)',
      description:
        'Draft description for upcoming research project in data science. Project details and requirements to be finalized.',
      researchCategories: ['Data Science', 'Statistics'],
      campus: Campus.CORAL_GABLES,
      requirements: [
        'Statistics background',
        'R or Python experience',
        'Data visualization skills',
      ],
      status: ProjectStatus.DRAFT,
      positions: 2,
    },
  },
};

export const updateProjectExamples = {
  fullUpdate: {
    summary: 'Full Project Update',
    description: 'Example of updating multiple project fields',
    value: {
      title: 'Updated: ML Research Position',
      description:
        'Updated project description with expanded scope and new requirements.',
      researchCategories: [
        'Machine Learning',
        'Natural Language Processing',
        'Cloud Computing',
      ],
      requirements: [
        'Advanced Python programming skills',
        'Experience with NLP libraries',
        'Knowledge of cloud platforms (AWS/GCP)',
      ],
      campus: Campus.CORAL_GABLES,
      positions: 3,
      applicationDeadline: dateUtils.getFutureDate(2),
    },
  },
  statusUpdate: {
    summary: 'Status Update',
    description: 'Example of updating project status to closed',
    value: {
      status: ProjectStatus.CLOSED,
    },
  },
  deadlineExtension: {
    summary: 'Deadline Extension',
    description: 'Example of extending the application deadline',
    value: {
      applicationDeadline: dateUtils.getFutureDate(1),
    },
  },
  requirementsUpdate: {
    summary: 'Requirements Update',
    description: 'Example of updating project requirements',
    value: {
      requirements: [
        'Updated: Advanced programming skills required',
        'Minimum GPA of 3.5',
        'Available 10-15 hours per week',
      ],
    },
  },
};

export const projectResponseExample = {
  id: '507f1f77bcf86cd799439011',
  title: 'Machine Learning Research Assistant',
  description:
    'Seeking motivated research assistants for an exciting ML project...',
  campus: Campus.CORAL_GABLES,
  professor: {
    id: '507f1f77bcf86cd799439012',
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    email: 'john.doe@miami.edu',
    department: 'Computer Science',
  },
  researchCategories: ['Machine Learning', 'Computer Vision'],
  requirements: [
    'Strong programming skills in Python',
    'Experience with PyTorch or TensorFlow',
  ],
  files: [], // Currently not implemented
  status: ProjectStatus.PUBLISHED,
  positions: 2,
  applicationDeadline: dateUtils.getFutureDate(3),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

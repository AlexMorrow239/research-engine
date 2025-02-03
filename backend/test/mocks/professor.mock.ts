import { Types } from 'mongoose';

import {
  CreateProfessorDto,
  ProfessorResponseDto,
  UpdateProfessorDto,
} from '../../src/common/dto/professors';

export const mockProfessorId = new Types.ObjectId().toString();

export const mockCreateProfessorDto: CreateProfessorDto = {
  email: 'john.doe@miami.edu',
  password: 'Password123!',
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
  department: 'Computer Science',
  title: 'Associate Professor',
  researchAreas: ['Machine Learning', 'Artificial Intelligence'],
  office: 'McArthur Engineering Building, Room 123',
  publications: [
    {
      title: 'Machine Learning in Healthcare',
      link: 'https://doi.org/10.1234/example',
    },
  ],
  bio: 'Specializing in artificial intelligence and machine learning research.',
};

export const mockUpdateProfessorDto: UpdateProfessorDto = {
  name: {
    firstName: 'John',
    lastName: 'Smith',
  },
  title: 'Full Professor',
  researchAreas: ['Machine Learning', 'Artificial Intelligence', 'Data Mining'],
  office: 'McArthur Engineering Building, Room 124',
  publications: [
    {
      title: 'Machine Learning in Healthcare',
      link: 'https://doi.org/10.1234/example',
    },
    {
      title: 'AI Applications in Education',
      link: 'https://doi.org/10.5678/example',
    },
  ],
  bio: 'Updated bio with focus on AI and ML applications.',
};

export const mockProfessorResponse: ProfessorResponseDto = {
  id: mockProfessorId,
  email: mockCreateProfessorDto.email,
  name: mockCreateProfessorDto.name,
  department: mockCreateProfessorDto.department,
  title: mockCreateProfessorDto.title,
  researchAreas: mockCreateProfessorDto.researchAreas,
  office: mockCreateProfessorDto.office,
  publications: mockCreateProfessorDto.publications,
  bio: mockCreateProfessorDto.bio,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Additional mock professors for testing list operations
export const mockProfessorsList = [
  mockProfessorResponse,
  {
    ...mockProfessorResponse,
    id: new Types.ObjectId().toString(),
    email: 'jane.smith@miami.edu',
    name: {
      firstName: 'Jane',
      lastName: 'Smith',
    },
    department: 'Computer Science',
    title: 'Assistant Professor',
    researchAreas: ['Computer Vision', 'Deep Learning'],
  },
  {
    ...mockProfessorResponse,
    id: new Types.ObjectId().toString(),
    email: 'robert.johnson@miami.edu',
    name: {
      firstName: 'Robert',
      lastName: 'Johnson',
    },
    department: 'Computer Science',
    title: 'Professor',
    researchAreas: ['Cybersecurity', 'Network Security'],
    isActive: false,
  },
];

// Mock for password change
export const mockChangePasswordData = {
  currentPassword: 'OldPassword123!',
  newPassword: 'NewPassword123!',
};

// Mock for account reactivation
export const mockReactivateAccountData = {
  email: 'robert.johnson@miami.edu',
  password: 'Password123!',
  adminPassword: 'AdminPassword123!',
};

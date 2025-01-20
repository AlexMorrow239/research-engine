import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { ApplicationDescriptions } from '../descriptions/applications.description';

export const ApiCreateApplication = () =>
  applyDecorators(
    ApiOperation(ApplicationDescriptions.create),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['application', 'resume'],
        properties: {
          application: {
            type: 'string',
            format: 'json',
            example: {
              studentInfo: {
                name: {
                  firstName: 'John',
                  lastName: 'Doe',
                },
                email: 'john.doe@miami.edu',
                cNumber: 'C12345678',
                phoneNumber: '305-123-4567',
                racialEthnicGroups: ['Hispanic/Latino'],
                citizenship: 'US_CITIZEN',
                academicStanding: 'JUNIOR',
                graduationDate: '2025-05-15',
                major1College: 'ARTS_AND_SCIENCES',
                major1: 'Computer Science',
                hasAdditionalMajor: false,
                isPreHealth: false,
                gpa: 3.5,
              },
              availability: {
                weeklyHours: '9-11',
                desiredProjectLength: '3',
                mondayAvailability: '9AM-5PM',
                tuesdayAvailability: '9AM-5PM',
                wednesdayAvailability: '9AM-5PM',
                thursdayAvailability: '9AM-5PM',
                fridayAvailability: '9AM-5PM',
              },
              additionalInfo: {
                hasPrevResearchExperience: true,
                prevResearchExperience:
                  "Worked in Dr. Smith's lab on machine learning research for 2 semesters",
                researchInterestDescription:
                  'Interested in artificial intelligence and its applications in healthcare',
                hasFederalWorkStudy: false,
                speaksOtherLanguages: true,
                additionalLanguages: ['Spanish', 'French'],
                comfortableWithAnimals: true,
              },
            },
          },
          resume: {
            type: 'string',
            format: 'binary',
            description: 'PDF resume file (max 5MB)',
          },
        },
      },
    }),
  );

export const ApiGetResume = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Download application resume',
      description: `
          Download the resume file for a specific application.
          
          Authentication:
          - Requires JWT token in Authorization header
          - Only accessible by the professor who owns the project
          
          Response:
          - Redirects to a pre-signed S3 URL for secure file download
          - URL is temporary and expires after a short period
          - File is served with correct content type and disposition headers
        `,
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Resume file download',
      content: {
        'application/pdf': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'application/msword': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Valid JWT token required',
    }),
    ApiNotFoundResponse({
      description: 'Application not found or professor does not have access',
    }),
    ApiParam({
      name: 'projectId',
      description: 'ID of the project',
      type: 'string',
    }),
    ApiParam({
      name: 'applicationId',
      description: 'ID of the application',
      type: 'string',
    }),
  );

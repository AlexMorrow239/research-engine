import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBody,
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

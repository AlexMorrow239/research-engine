import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApplicationStatus } from '@common/enums';

import { Application } from '@/modules/applications/schemas/applications.schema';

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailTemplateService {
  constructor(private readonly configService: ConfigService) {}

  private getFrontendUrl(): string {
    const isNetworkMode = this.configService.get<string>('NETWORK_MODE') === 'true';
    const env = this.configService.get<string>('NODE_ENV');

    if (env === 'development') {
      return isNetworkMode
        ? this.configService.get<string>('FRONTEND_URL_NETWORK', 'http://100.65.62.87:5173')
        : this.configService.get<string>('FRONTEND_URL_LOCAL', 'http://localhost:5173');
    }

    // For production, use the production frontend URL
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
  }

  private getEmailStyles(): string {
    return `
      <style>
        .email-container {
          font-family: 'Roboto', Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #334155;
        }
        .header {
          color: #005030;
          margin-bottom: 20px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        .footer {
          margin-top: 20px;
          color: #64748b;
          font-size: 14px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
        }
        .footer-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 20px 0;
          padding: 20px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .footer-logo {
          max-height: 40px;
          width: auto;
        }
        .info-section {
          margin: 15px 0;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 4px;
        }
        .info-label {
          font-weight: 500;
          color: #005030;
          min-width: 150px;
          display: inline-block;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #7ec265;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
          font-weight: 500;
        }
        .status-update {
          font-size: 18px;
          color: #005030;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 4px;
          text-align: center;
          margin: 20px 0;
        }
        .warning {
          color: #ef4444;
          background-color: #fef2f2;
          border: 1px solid #ef4444;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .accent {
          color: #f47321;
        }
      </style>
    `;
  }

  private getEmailFooter(): string {
    return `
      <div class="footer">
        <div class="footer-logos">
          <img src="https://placeholder-url/um-logo.png" alt="University of Miami" class="footer-logo" />
          <img src="https://placeholder-url/research-engine-logo.png" alt="Research Engine" class="footer-logo" />
        </div>
        <p style="color: #005030; font-weight: 500;">University of Miami Research Engine</p>
        <p>1320 S Dixie Hwy, Coral Gables, FL 33146</p>
        <p style="font-size: 12px; color: #64748b;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `;
  }

  getApplicationConfirmationTemplate(
    projectTitle: string,
    studentName: { firstName: string; lastName: string },
  ): EmailTemplate {
    const text = `Dear ${studentName.firstName} ${studentName.lastName},

Thank you for submitting your application for "${projectTitle}". Your application has been received and the professor will contact you directly if they wish to proceed with your application.

Best regards,
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Application Confirmation</h2>
            </div>
            <div class="content">
              <p>Dear ${studentName.firstName} ${studentName.lastName},</p>
              <p>Thank you for submitting your application for <strong class="accent">"${projectTitle}"</strong>.</p>
              <p>Your application has been received and the professor will contact you directly if they wish to proceed with your application.</p>
            </div>
            ${this.getEmailFooter()}
          </div>
        </body>
      </html>
    `;

    return { subject: 'Research Application Confirmation', text, html };
  }

  getProfessorNotificationTemplate(
    projectTitle: string,
    application: Application,
    resumeDownloadUrl: string,
  ): EmailTemplate {
    const text = `Dear Professor,
  
A new application has been submitted for your research opportunity "${projectTitle}". Below is the applicant's information:

Basic Information:
- Name: ${application.studentInfo.name.firstName} ${application.studentInfo.name.lastName}
- Email: ${application.studentInfo.email}
- Phone: ${application.studentInfo.phoneNumber}
- C-Number: ${application.studentInfo.cNumber}
- GPA: ${application.studentInfo.gpa}

Academic Information:
- Major 1: ${application.studentInfo.major1} (${application.studentInfo.major1College})
${application.studentInfo.hasAdditionalMajor ? `- Major 2: ${application.studentInfo.major2} (${application.studentInfo.major2College})\n` : ''}- Academic Standing: ${application.studentInfo.academicStanding}
- Expected Graduation: ${new Date(application.studentInfo.graduationDate).toLocaleDateString()}
${application.studentInfo.isPreHealth ? `- Pre-Health Track: ${application.studentInfo.preHealthTrack || 'Yes'}\n` : ''}
Availability:
- Monday: ${application.availability.mondayAvailability}
- Tuesday: ${application.availability.tuesdayAvailability}
- Wednesday: ${application.availability.wednesdayAvailability}
- Thursday: ${application.availability.thursdayAvailability}
- Friday: ${application.availability.fridayAvailability}
- Weekly Hours: ${application.availability.weeklyHours}
- Desired Project Commitment: ${application.availability.desiredProjectLength}

Additional Information:
- Previous Research Experience: ${application.additionalInfo.hasPrevResearchExperience ? 'Yes' : 'No'}
${application.additionalInfo.hasPrevResearchExperience && application.additionalInfo.prevResearchExperience ? `- Research Experience Details: ${application.additionalInfo.prevResearchExperience}\n` : ''}- Statement of Interest: ${application.additionalInfo.researchInterestDescription}
- Federal Work Study: ${application.additionalInfo.hasFederalWorkStudy ? 'Yes' : 'No'}
${application.additionalInfo.speaksOtherLanguages && application.additionalInfo.additionalLanguages?.length ? `- Additional Languages: ${application.additionalInfo.additionalLanguages.join(', ')}\n` : ''}- Comfortable with Animals: ${application.additionalInfo.comfortableWithAnimals ? 'Yes' : 'No'}

Resume: ${resumeDownloadUrl}

Please contact the student directly if you wish to proceed with their application.
If you accept a student for this position, they must complete the Self-Placement form available at: https://ugr.miami.edu/research/placement/index.html

Best regards,
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>New Research Application</h2>
            </div>
            <div class="content">
              <p>A new application has been submitted for your research opportunity <strong class="accent">"${projectTitle}"</strong>.</p>
              
              <div class="info-section">
                <h3 style="color: #005030; margin-bottom: 15px;">Basic Information</h3>
                <p><span class="info-label">Name:</span> ${application.studentInfo.name.firstName} ${application.studentInfo.name.lastName}</p>
                <p><span class="info-label">Email:</span> <a href="mailto:${application.studentInfo.email}" style="color: #7ec265;">${application.studentInfo.email}</a></p>
                <p><span class="info-label">Phone:</span> ${application.studentInfo.phoneNumber}</p>
                <p><span class="info-label">C-Number:</span> ${application.studentInfo.cNumber}</p>
                <p><span class="info-label">GPA:</span> ${application.studentInfo.gpa}</p>
              </div>

              <div class="info-section">
                <h3 style="color: #005030; margin-bottom: 15px;">Academic Information</h3>
                <p><span class="info-label">Major 1:</span> ${application.studentInfo.major1} (${application.studentInfo.major1College})</p>
                ${application.studentInfo.hasAdditionalMajor ? `<p><span class="info-label">Major 2:</span> ${application.studentInfo.major2} (${application.studentInfo.major2College})</p>` : ''}
                <p><span class="info-label">Academic Standing:</span> ${application.studentInfo.academicStanding}</p>
                <p><span class="info-label">Expected Graduation:</span> ${new Date(application.studentInfo.graduationDate).toLocaleDateString()}</p>
                ${application.studentInfo.isPreHealth ? `<p><span class="info-label">Pre-Health Track:</span> ${application.studentInfo.preHealthTrack || 'Yes'}</p>` : ''}
              </div>

              <div class="info-section">
                <h3 style="color: #005030; margin-bottom: 15px;">Availability</h3>
                <p><span class="info-label">Weekly Hours:</span> ${application.availability.weeklyHours}</p>
                <p><span class="info-label">Project Length:</span> ${application.availability.desiredProjectLength}</p>
                <p><span class="info-label">Schedule:</span></p>
                <ul style="list-style-type: none; padding-left: 20px; margin: 10px 0;">
                  <li style="margin: 5px 0;">• Monday: ${application.availability.mondayAvailability}</li>
                  <li style="margin: 5px 0;">• Tuesday: ${application.availability.tuesdayAvailability}</li>
                  <li style="margin: 5px 0;">• Wednesday: ${application.availability.wednesdayAvailability}</li>
                  <li style="margin: 5px 0;">• Thursday: ${application.availability.thursdayAvailability}</li>
                  <li style="margin: 5px 0;">• Friday: ${application.availability.fridayAvailability}</li>
                </ul>
              </div>

              <div class="info-section">
                <h3 style="color: #005030; margin-bottom: 15px;">Additional Information</h3>
                <p><span class="info-label">Previous Research Experience:</span> ${application.additionalInfo.hasPrevResearchExperience ? 'Yes' : 'No'}</p>
                ${
                  application.additionalInfo.hasPrevResearchExperience &&
                  application.additionalInfo.prevResearchExperience
                    ? `
                <div style="margin: 10px 0;">
                  <span class="info-label">Research Experience Details:</span>
                  <div style="margin-left: 150px; margin-top: -24px;">${application.additionalInfo.prevResearchExperience}</div>
                </div>`
                    : ''
                }
                <div style="margin: 10px 0;">
                  <span class="info-label">Statement of Interest:</span>
                  <div style="margin-left: 150px; margin-top: -24px;">${application.additionalInfo.researchInterestDescription}</div>
                </div>
                <p><span class="info-label">Federal Work Study:</span> ${application.additionalInfo.hasFederalWorkStudy ? 'Yes' : 'No'}</p>
                ${application.additionalInfo.speaksOtherLanguages && application.additionalInfo.additionalLanguages?.length ? `<p><span class="info-label">Additional Languages:</span> ${application.additionalInfo.additionalLanguages.join(', ')}</p>` : ''}
                <p><span class="info-label">Comfortable with Animals:</span> ${application.additionalInfo.comfortableWithAnimals ? 'Yes' : 'No'}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resumeDownloadUrl}" class="button" style="background-color: #7ec265; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 500;">Download Resume</a>
              </div>

              <div style="background-color: #f8fafc; padding: 20px; border-radius: 4px; margin-top: 20px;">
                <p style="color: #005030; font-weight: 500; margin-bottom: 10px;">Next Steps:</p>
                <p>1. Review the application details above</p>
                <p>2. Contact the student directly if you wish to proceed</p>
                <p>3. If you accept the student, ensure they complete the <a href="https://ugr.miami.edu/research/placement/index.html" target="_blank" style="color: #7ec265; text-decoration: underline;">Self-Placement form</a></p>
              </div>
            </div>
            ${this.getEmailFooter()}
          </div>
        </body>
      </html>
    `;

    return {
      subject: `New Research Application: ${projectTitle}`,
      text,
      html,
    };
  }

  getProjectClosedTemplate(projectTitle: string): EmailTemplate {
    const text = `Dear Student,

The research opportunity "${projectTitle}" is no longer available. Thank you for your interest.

Best regards,
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Research Opportunity Update</h2>
            </div>
            <div class="content">
              <div class="warning">
                The research opportunity "${projectTitle}" is no longer available.
              </div>
              <p>Thank you for your interest in this opportunity.</p>
            </div>
            ${this.getEmailFooter()}
          </div>
        </body>
      </html>
    `;

    return { subject: `Research Opportunity No Longer Available: ${projectTitle}`, text, html };
  }

  getApplicationStatusUpdateTemplate(
    projectTitle: string,
    status: ApplicationStatus,
  ): EmailTemplate {
    const text = `Your application for "${projectTitle}" has been ${status.toLowerCase()}.`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Application Status Update</h2>
            </div>
            <div class="content">
              <p>Your application for <strong class="accent">"${projectTitle}"</strong> has been updated.</p>
              <div class="status-update">
                Application Status: ${status.toLowerCase()}
              </div>
            </div>
            ${this.getEmailFooter()}
          </div>
        </body>
      </html>
    `;

    return {
      subject: `Research Engine - Application Status Update for ${projectTitle}`,
      text,
      html,
    };
  }

  getPasswordResetTemplate(firstName: string, resetToken: string): EmailTemplate {
    const frontendUrl = this.getFrontendUrl();
    const resetUrl = `${frontendUrl}/faculty/auth/reset-password?token=${resetToken}`;

    const text = `Dear ${firstName},

You have requested to reset your password for your Research Engine account. Please click the link below to reset your password:

${resetUrl}

This link will expire in 1 hour. If you did not request this password reset, please ignore this email.

Best regards,
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              <p>You have requested to reset your password for your Research Engine account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <div class="warning">
                This link will expire in 1 hour. If you did not request this password reset, please ignore this email.
              </div>
            </div>
            ${this.getEmailFooter()}
          </div>
        </body>
      </html>
    `;

    return {
      subject: 'Research Engine - Password Reset Request',
      text,
      html,
    };
  }
}

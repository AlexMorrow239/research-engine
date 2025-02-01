import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { ErrorHandler } from '@/common/utils/error-handler.util';
import { DownloadUrlService } from './services/download-url.service';
import { ApplicationStatus } from '@common/enums';

import { Application } from '../applications/schemas/applications.schema';
import { EmailTemplateService } from './services/email-template.service';
import { CustomLogger } from '@/common/services/logger.service';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(
    private readonly emailTemplateService: EmailTemplateService,
    private readonly downloadUrlService: DownloadUrlService,
    private readonly logger: CustomLogger,
    private readonly configService: ConfigService,
  ) {
    const smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.password'),
      },
    };
    this.transporter = nodemailer.createTransport(smtpConfig);
    this.logger.setContext('EmailService');
  }

  async sendApplicationConfirmation(application: Application, projectTitle: string): Promise<void> {
    try {
      this.logger.logObject(
        'debug',
        {
          applicationId: application.id,
          studentName: application.studentInfo.name,
          projectTitle,
        },
        'Sending application confirmation email',
      );

      const { subject, text, html } = this.emailTemplateService.getApplicationConfirmationTemplate(
        projectTitle,
        application.studentInfo.name,
      );

      await this.sendEmailWithRetry(application.studentInfo.email, subject, text, html);

      this.logger.log(
        `Application confirmation email sent successfully to ${application.studentInfo.email}`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send application confirmation', {
        applicationId: application.id,
        projectTitle,
        studentEmail: application.studentInfo.email,
      });
    }
  }

  async sendProfessorNewApplication(
    professorEmail: string,
    application: Application,
    projectTitle: string,
  ): Promise<void> {
    try {
      this.logger.logObject(
        'debug',
        {
          applicationId: application.id,
          professorEmail,
          projectTitle,
          studentName: application.studentInfo.name,
        },
        'Sending professor new application notification',
      );

      const projectId = String(application.project._id || application.project);
      const professorId = String(
        application.project.professor._id || application.project.professor,
      );

      const resumeDownloadUrl = await this.getResumeDownloadUrl(
        projectId,
        application.id,
        professorId,
      );

      const { subject, text, html } = this.emailTemplateService.getProfessorNotificationTemplate(
        projectTitle,
        application,
        resumeDownloadUrl,
      );

      await this.sendEmailWithRetry(professorEmail, subject, text, html);

      this.logger.log(
        `Professor notification email sent successfully to ${professorEmail} for application ${application.id}`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'send professor new application notification',
        {
          applicationId: application.id,
          professorEmail,
          projectTitle,
          projectId: String(application.project._id || application.project),
        },
      );
    }
  }

  private async getResumeDownloadUrl(
    projectId: string,
    applicationId: string,
    professorId: string,
  ): Promise<string> {
    try {
      this.logger.logObject(
        'debug',
        {
          projectId,
          applicationId,
          professorId,
        },
        'Generating resume download URL',
      );

      const url = await this.downloadUrlService.generateDownloadUrl(
        projectId,
        applicationId,
        professorId,
      );

      this.logger.debug(
        `Resume download URL generated successfully for application ${applicationId}`,
      );

      return url;
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'generate resume download URL', {
        projectId,
        applicationId,
        professorId,
      });
    }
  }

  async sendApplicationStatusUpdate(
    studentEmail: string,
    projectTitle: string,
    status: ApplicationStatus,
  ): Promise<void> {
    try {
      this.logger.logObject(
        'debug',
        {
          studentEmail,
          projectTitle,
          status,
        },
        'Sending application status update email',
      );

      const { subject, text, html } = this.emailTemplateService.getApplicationStatusUpdateTemplate(
        projectTitle,
        status,
      );

      await this.sendEmailWithRetry(studentEmail, subject, text, html);

      this.logger.log(
        `Application status update email sent successfully to ${studentEmail} (Status: ${status})`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send application status update', {
        studentEmail,
        projectTitle,
        status,
      });
    }
  }

  private async sendEmailWithRetry(
    to: string,
    subject: string,
    text: string,
    html: string,
    retryCount = 0,
  ): Promise<void> {
    try {
      this.logger.logObject(
        'debug',
        {
          to,
          subject,
          retryCount,
          maxRetries: this.MAX_RETRIES,
        },
        'Attempting to send email',
      );

      const fromAddress = this.configService.get('email.fromAddress');
      await this.transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: `${text}\n\nNOTE: This email was sent from a no-reply address. Please do not reply to this email.`,
        html: `${html}\n<p style="color: #64748b; font-size: 12px; margin-top: 20px;">NOTE: This email was sent from a no-reply address. Please do not reply to this email.</p>`,
        replyTo: fromAddress,
      });

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(
          `Failed to send email to ${to}, retrying... (${retryCount + 1}/${this.MAX_RETRIES})`,
        );

        this.logger.logObject(
          'debug',
          {
            to,
            subject,
            retryCount: retryCount + 1,
            delayMs: this.RETRY_DELAY,
            error: error.message,
          },
          'Scheduling email retry',
        );

        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.sendEmailWithRetry(to, subject, text, html, retryCount + 1);
      }

      ErrorHandler.handleServiceError(this.logger, error, 'send email', {
        to,
        subject,
        retryCount,
        maxRetries: this.MAX_RETRIES,
      });
    }
  }

  async sendProjectClosedNotification(studentEmail: string, projectTitle: string): Promise<void> {
    try {
      this.logger.logObject(
        'debug',
        {
          studentEmail,
          projectTitle,
        },
        'Sending project closed notification email',
      );

      const { subject, text, html } =
        this.emailTemplateService.getProjectClosedTemplate(projectTitle);

      await this.sendEmailWithRetry(studentEmail, subject, text, html);

      this.logger.log(
        `Project closed notification email sent successfully to ${studentEmail} for project "${projectTitle}"`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send project closed notification', {
        studentEmail,
        projectTitle,
      });
    }
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
  ): Promise<void> {
    try {
      this.logger.logObject(
        'debug',
        {
          email,
          firstName,
          hasResetToken: !!resetToken, // Don't log the actual token for security
        },
        'Sending password reset email',
      );

      const { subject, text, html } = this.emailTemplateService.getPasswordResetTemplate(
        firstName,
        resetToken,
      );

      await this.sendEmailWithRetry(email, subject, text, html);

      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send password reset email', {
        email,
        firstName,
      });
    }
  }
}

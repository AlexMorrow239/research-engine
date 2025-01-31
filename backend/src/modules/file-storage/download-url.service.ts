import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GetObjectCommand, ListObjectsV2Command, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class DownloadUrlService {
  private readonly s3Client: S3;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {
    this.bucketName = this.configService.getOrThrow<string>("AWS_BUCKET_NAME");

    this.s3Client = new S3({
      region: this.configService.getOrThrow<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.getOrThrow<string>(
          "AWS_SECRET_ACCESS_KEY"
        ),
      },
    });
  }

  async generateDownloadUrl(
    projectId: string,
    applicationId: string,
    professorId: string
  ): Promise<string> {
    try {
      const prefix = `applications/${projectId}/cv/`;

      this.logger.debug(`Searching for files with prefix: ${prefix}`);

      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(listCommand);

      this.logger.debug(
        "Found files:",
        response.Contents?.map((obj) => obj.Key)
      );

      // Get the most recent file in the directory
      const mostRecentFile = response.Contents?.sort((a, b) => {
        const dateA = a.LastModified?.getTime() || 0;
        const dateB = b.LastModified?.getTime() || 0;
        return dateB - dateA;
      })[0];

      if (!mostRecentFile?.Key) {
        this.logger.error("No resume file found:", {
          projectId,
          applicationId,
          prefix,
          foundFiles: response.Contents?.map((obj) => obj.Key),
        });
        throw new Error(
          `No resume file found for application ${applicationId}`
        );
      }

      this.logger.debug(`Found file: ${mostRecentFile.Key}`);

      // Create the GetObject command with the actual file path
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: mostRecentFile.Key,
      });

      // Generate a signed URL that expires in 7 days
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      });

      this.logger.debug(
        `Generated download URL successfully for file: ${mostRecentFile.Key}`
      );
      return url;
    } catch (error) {
      this.logger.error("Failed to generate download URL:", {
        error: error.message,
        projectId,
        applicationId,
        professorId,
        bucket: this.bucketName,
        stackTrace: error.stack,
      });
      throw error;
    }
  }
}

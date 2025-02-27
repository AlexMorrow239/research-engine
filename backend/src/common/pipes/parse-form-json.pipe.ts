import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseFormJsonPipe implements PipeTransform {
  private readonly logger = new Logger(ParseFormJsonPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Application data is required');
    }

    try {
      // Parse the JSON string if it's a string, otherwise use the value as-is
      const parsedData = typeof value === 'string' ? JSON.parse(value) : value;

      return parsedData;
    } catch (error) {
      this.logger.error('Failed to parse application data', { error });
      throw new BadRequestException('Invalid application data format');
    }
  }
}

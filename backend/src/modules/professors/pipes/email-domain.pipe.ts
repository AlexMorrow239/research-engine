import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateProfessorDto } from '../../../common/dto/professors/create-professor.dto';
import { InvalidEmailDomainException } from '../exceptions/invalid-email-domain.exception';

@Injectable()
export class EmailDomainPipe implements PipeTransform {
  transform(value: CreateProfessorDto) {
    const validDomains = [
      '@miami.edu',
      '@med.miami.edu',
      '@cd.miami.edu',
      // Add other valid Miami domains as needed
    ];

    if (!validDomains.some((domain) => value.email.endsWith(domain))) {
      throw new InvalidEmailDomainException();
    }
    return value;
  }
}

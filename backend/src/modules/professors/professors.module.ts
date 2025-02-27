import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';
import { Professor, ProfessorSchema } from './schemas/professors.schema';
import { CustomLogger } from '@/common/services/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Professor.name, schema: ProfessorSchema }]),
    ConfigModule,
  ],
  providers: [ProfessorsService, CustomLogger],
  controllers: [ProfessorsController],
  exports: [ProfessorsService],
})
export class ProfessorsModule {}

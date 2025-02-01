import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsController } from '../professors.controller';

describe('ProfessorsController', () => {
  let controller: ProfessorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessorsController],
    }).compile();

    controller = module.get<ProfessorsController>(ProfessorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Add more test cases for professor service methods
});

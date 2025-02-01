import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from '../applications.controller';
import { ApplicationsService } from '../applications.service';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            create: jest.fn(),
            findProjectApplications: jest.fn(),
            updateStatus: jest.fn(),
            getResume: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Add test cases for:
  // - create()
  // - findAll()
  // - updateStatus()
  // - downloadResume()
});

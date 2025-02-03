import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MongooseModelMock } from '@test/mocks/mongoose.mock';
import {
  mockChangePasswordData,
  mockCreateProfessorDto,
  mockProfessorResponse,
  mockReactivateAccountData,
  mockUpdateProfessorDto,
} from '@test/mocks/professor.mock';
import * as bcrypt from 'bcrypt';

import { CustomLogger } from '@/common/services/logger.service';

import { ProfessorsService } from '../professors.service';
import { Professor } from '../schemas/professors.schema';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// mock ConfigService
const mockConfigService = {
  get: jest.fn((key: string, defaultValue: any) => {
    switch (key) {
      case 'environment.nodeEnv':
        return 'test';
      case 'environment.isNetworkMode':
        return false;
      default:
        return defaultValue;
    }
  }),
} as unknown as ConfigService;

describe('ProfessorsService', () => {
  let service: ProfessorsService;
  let professorModel: MongooseModelMock<Professor>;
  let logger: CustomLogger;

  beforeEach(async () => {
    professorModel = new MongooseModelMock<Professor>();
    logger = new CustomLogger(mockConfigService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: getModelToken(Professor.name),
          useValue: professorModel,
        },
        {
          provide: CustomLogger,
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfessor', () => {
    it('should create a new professor successfully', async () => {
      jest.spyOn(professorModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(professorModel, 'create').mockResolvedValueOnce({
        ...mockProfessorResponse,
        toObject: () => ({
          ...mockProfessorResponse,
          password: 'hashedPassword',
        }),
      } as any);

      const result = await service.createProfessor(mockCreateProfessorDto);

      expect(result).toEqual(mockProfessorResponse);
      expect(professorModel.findOne).toHaveBeenCalledWith({
        email: mockCreateProfessorDto.email,
      });
      expect(professorModel.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      jest
        .spyOn(professorModel, 'findOne')
        .mockResolvedValueOnce(mockProfessorResponse as any);

      await expect(
        service.createProfessor(mockCreateProfessorDto)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfessor', () => {
    it('should return professor profile successfully', async () => {
      jest.spyOn(professorModel, 'findById').mockResolvedValueOnce({
        ...mockProfessorResponse,
        toObject: () => ({
          ...mockProfessorResponse,
          password: 'hashedPassword',
        }),
      } as any);

      const result = await service.getProfessor(mockProfessorResponse.id);

      expect(result).toEqual(mockProfessorResponse);
      expect(professorModel.findById).toHaveBeenCalledWith(
        mockProfessorResponse.id
      );
    });

    it('should throw NotFoundException if professor not found', async () => {
      jest.spyOn(professorModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.getProfessor('nonexistentId')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateProfessor', () => {
    it('should update professor profile successfully', async () => {
      const updatedProfessor = {
        ...mockProfessorResponse,
        ...mockUpdateProfessorDto,
      };

      jest
        .spyOn(professorModel, 'findById')
        .mockResolvedValueOnce(mockProfessorResponse as any);
      jest.spyOn(professorModel, 'findByIdAndUpdate').mockResolvedValueOnce({
        ...updatedProfessor,
        toObject: () => ({ ...updatedProfessor, password: 'hashedPassword' }),
      } as any);

      const result = await service.updateProfessor(
        mockProfessorResponse.id,
        mockUpdateProfessorDto
      );

      expect(result).toEqual(updatedProfessor);
      expect(professorModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProfessorResponse.id,
        { $set: mockUpdateProfessorDto },
        { new: true }
      );
    });

    it('should throw NotFoundException if professor not found', async () => {
      jest.spyOn(professorModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.updateProfessor('nonexistentId', mockUpdateProfessorDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // describe('changeProfessorPassword', () => {
  //   it('should change password successfully', async () => {
  //     jest.spyOn(professorModel, 'findById').mockResolvedValueOnce({
  //       ...mockProfessorResponse,
  //       password: 'hashedPassword',
  //     } as any);

  //     await service.changeProfessorPassword(
  //       mockProfessorResponse.id,
  //       mockChangePasswordData.currentPassword,
  //       mockChangePasswordData.newPassword
  //     );

  //     expect(bcrypt.compare).toHaveBeenCalledWith(
  //       mockChangePasswordData.currentPassword,
  //       'hashedPassword'
  //     );
  //     expect(professorModel.findByIdAndUpdate).toHaveBeenCalled();
  //   });

  //   it('should throw UnauthorizedException if current password is incorrect', async () => {
  //     jest.spyOn(professorModel, 'findById').mockResolvedValueOnce({
  //       ...mockProfessorResponse,
  //       password: 'hashedPassword',
  //     } as any);
  //     (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

  //     await expect(
  //       service.changeProfessorPassword(
  //         mockProfessorResponse.id,
  //         'wrongPassword',
  //         mockChangePasswordData.newPassword
  //       )
  //     ).rejects.toThrow(UnauthorizedException);
  //   });
  // });

  describe('deactivateProfessorAccount', () => {
    it('should deactivate account successfully', async () => {
      jest
        .spyOn(professorModel, 'findById')
        .mockResolvedValueOnce(mockProfessorResponse as any);
      jest
        .spyOn(professorModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(mockProfessorResponse as any);

      await service.deactivateProfessorAccount(mockProfessorResponse.id);

      expect(professorModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProfessorResponse.id,
        {
          isActive: false,
        }
      );
    });

    it('should throw NotFoundException if professor not found', async () => {
      jest.spyOn(professorModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.deactivateProfessorAccount('nonexistentId')
      ).rejects.toThrow(NotFoundException);
    });
  });

  // describe('reactivateProfessorAccount', () => {
  //   it('should reactivate account successfully', async () => {
  //     const inactiveProfessor = {
  //       ...mockProfessorResponse,
  //       isActive: false,
  //       password: 'hashedPassword',
  //     };
  //     jest
  //       .spyOn(professorModel, 'findOne')
  //       .mockResolvedValueOnce(inactiveProfessor as any);

  //     await service.reactivateProfessorAccount(mockReactivateAccountData);

  //     expect(professorModel.findByIdAndUpdate).toHaveBeenCalledWith(
  //       mockProfessorResponse.id,
  //       {
  //         isActive: true,
  //       }
  //     );
  //   });

  // it('should throw UnauthorizedException if professor not found', async () => {
  //   jest.spyOn(professorModel, 'findOne').mockResolvedValueOnce(null);

  //   await expect(
  //     service.reactivateProfessorAccount(mockReactivateAccountData)
  //   ).rejects.toThrow(UnauthorizedException);
  // });

  //   it('should throw UnauthorizedException if password is incorrect', async () => {
  //     jest.spyOn(professorModel, 'findOne').mockResolvedValueOnce({
  //       ...mockProfessorResponse,
  //       password: 'hashedPassword',
  //     } as any);
  //     (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

  //     await expect(
  //       service.reactivateProfessorAccount(mockReactivateAccountData)
  //     ).rejects.toThrow(UnauthorizedException);
  //   });
  // });
});

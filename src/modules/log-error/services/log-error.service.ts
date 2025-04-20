import { InjectRepository } from '@nestjs/typeorm';
import { LogErrorEntity } from '../entities/log-error.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateLogErrorType } from '../types/create-log-error.type';

@Injectable()
export class LogErrorService {
  constructor(
    @InjectRepository(LogErrorEntity)
    private readonly logErrorRepository: Repository<LogErrorEntity>,
  ) {}

  async create(dto: CreateLogErrorType) {
    const log = new LogErrorEntity();
    log.message = dto.message;
    log.errorCode = dto.errorCode;
    log.stackTrade = dto.stackTrade;
    log.path = dto.path;
    log.method = dto.method;

    return await this.logErrorRepository.save(log);
  }
}

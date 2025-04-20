import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';
import { LogErrorService } from './services/log-error.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpFilterException } from 'src/common/exception/http-filter.exception';

@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [
    LogErrorService,
    {
      provide: APP_FILTER,
      useClass: HttpFilterException,
    },
  ],
})
export class LogErrorModule {}

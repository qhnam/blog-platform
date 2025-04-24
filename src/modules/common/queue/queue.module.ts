import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { QUEUE_PROCESSOR } from './enums';
import { QueueService } from './services/queue.service';
import { ENVIRONMENT } from 'src/common/const/environment';
import { CommonModule } from '../common.module';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: ENVIRONMENT.REDIS_HOST,
        port: Number(ENVIRONMENT.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({ name: QUEUE_PROCESSOR.EMAIL_PROCESSOR }),
    CommonModule,
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

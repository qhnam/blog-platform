import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { ISendMailInput } from '../../mail/types';
import { QUEUE_PROCESS, QUEUE_PROCESSOR } from '../enums';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_PROCESSOR.EMAIL_PROCESSOR)
    private readonly emailQueue: Queue,
  ) {}

  async addSendEmailJob(data: ISendMailInput) {
    await this.emailQueue.add(QUEUE_PROCESS.EMAIL_PROCESS, data, {
      delay: 6000,
      attempts: 3,
      backoff: 3000,
    });
  }
}

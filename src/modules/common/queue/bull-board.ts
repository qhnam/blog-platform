import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_PROCESSOR } from './enums';

export function createBullBoardUI(app: INestApplication) {
  const queues: Queue[] = [
    app.get<Queue>(getQueueToken(QUEUE_PROCESSOR.EMAIL_PROCESSOR) as string),
  ];

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: queues.map((q) => new BullAdapter(q)),
    serverAdapter,
  });

  return serverAdapter;
}

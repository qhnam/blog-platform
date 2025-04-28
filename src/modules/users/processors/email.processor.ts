import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/modules/common/mail/services/mail.service';
import { ISendMailInput } from 'src/modules/common/mail/types';
import { QUEUE_PROCESS, QUEUE_PROCESSOR } from 'src/modules/common/queue/enums';

@Processor(QUEUE_PROCESSOR.EMAIL_PROCESSOR)
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process(QUEUE_PROCESS.EMAIL_PROCESS)
  async handleSendMail(data: Job<ISendMailInput>) {
    await this.mailService.sendMail(data.data);
  }
}

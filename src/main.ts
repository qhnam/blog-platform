import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import { CustomPipeValidationException } from './common/exception/custom-pipe-validation.exception';
import { createBullBoardUI } from './modules/common/queue/bull-board';

async function bootstrap() {
  initializeTransactionalContext();

  const app: INestApplication = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  addTransactionalDataSource(dataSource);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new CustomPipeValidationException());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const bullBoardAdapter = createBullBoardUI(app);
  app.use('/admin/queues', bullBoardAdapter.getRouter());

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Server is listening at ${port}`);
  });
}

bootstrap();

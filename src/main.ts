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
import basicAuth from 'basic-auth';
import { Request, Response, NextFunction } from 'express';
import { ENVIRONMENT } from './common/const/environment';

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

  // const bullBoardAdapter = createBullBoardUI(app);

  const router = createBullBoardUI(app).getRouter();

  app.use(
    '/admin/queues',
    (req: Request, res: Response, next: NextFunction) => {
      const user = basicAuth(req);
      if (
        !user ||
        user.name !== ENVIRONMENT.BULL_BOARD_USER ||
        user.pass !== ENVIRONMENT.DATABASE_PASSWORD
      ) {
        res.setHeader(
          'WWW-Authenticate',
          'Basic realm="Authorization required"',
        );
        return res.status(401).send('Authentication required');
      }
      next();
    },
    router,
  );
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Server is listening at ${port}`);
  });
}

bootstrap();

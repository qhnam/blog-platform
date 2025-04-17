import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpFilterException } from './common/exception/http-filter.exception';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomPipeValidationException } from './common/exception/custom-pipe-validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new CustomPipeValidationException());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalFilters(new HttpFilterException());

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Server is listening at ${port}`);
  });
}

bootstrap();

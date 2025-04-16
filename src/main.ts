import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpFilterException } from './common/exception/http-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpFilterException());

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Server is listening at ${port}`);
  });
}

bootstrap();

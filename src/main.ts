import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // global response wrapper and exception filter
  const { ResponseInterceptor } = await import('./common/response.interceptor');
  const { AllExceptionsFilter } = await import('./common/http-exception.filter');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Slökun API')
    .setDescription('Slökun Backend MVP')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  const port = process.env.PORT || 3000;
  await app.listen(+port);
  Logger.log(`Server listening on http://localhost:${port}`);
}
bootstrap();

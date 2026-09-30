import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // we use this configService to safely access environment variables (.env)
  const configService = app.get(ConfigService);
  app.use(cookieParser());

  // Just the api prefix that will start with /api
  app.setGlobalPrefix('api');

  // We apply our custom httpExceptionfilter in common and filter folder
  app.useGlobalFilters(new HttpExceptionFilter());

  // we use this global pipes for incoming request bodies against
  // with the DTO using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // automatically strips any properties that not exist in the DTO
      forbidNonWhitelisted: true, // throw an error to the undeclared properties (e.g., if a user tries to send "role": "admin" in a register request, it rejects it immediately).
      transform: true, // automatically transform the plain javascript object into typed instance of their DTO classes
    }),
  );

  // Start implement or initialize the swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS - Authentication - API')
    .setDescription('Complete authentication system')
    .setVersion('1.0')
    .addBearerAuth() // adds the authorize button in swagger ui to test protected routes with JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`API is running on http://localhost:${port}/api`);
  console.log(
    `The Swagger docs is running on http://localhost:${port}/api/docs`,
  );
}
bootstrap();

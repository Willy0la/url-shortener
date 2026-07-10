import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`, `https://jsdelivr.net`],
          styleSrc: [`'self'`, `'unsafe-inline'`, `https://jsdelivr.net`],
          imgSrc: [`'self'`, `data:`, `https://jsdelivr.net`],
        },
      },
    }),
  );
  const logger = new Logger('bootstrap');
  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT', 5004);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.get<string>('CLIENT_URL'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  if (config.get<string>('NODE_ENV') !== `production`) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('shortUrl API')
      .setDescription('User Authentication and Url shortener')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  logger.log('CLIENT_URL resolved as:', config.get<string>('CLIENT_URL'));
  await app.listen(PORT);
  logger.log(`server is listening on  http://localhost:${PORT}`);
  logger.log(`Swagger docs available at http://localhost:${PORT}/api`);
}
void bootstrap();

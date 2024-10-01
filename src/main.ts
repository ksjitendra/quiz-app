import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    forbidNonWhitelisted: true , 
    enableDebugMessages: true,  
  }));

  const configService = app.get(ConfigService)
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('v1');
  
  await app.listen(configService.get('app.port'));
}
bootstrap();

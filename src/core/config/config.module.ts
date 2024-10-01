import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import baseDevConfig from './config.development';

// Find the current environment and load the config file accordingly
let currentConfig = baseDevConfig;
let currentConfigFileName = `.env.${process.env.NODE_ENV}`;
switch (process.env.NODE_ENV) {
  case 'development':
    currentConfig = baseDevConfig;
    break;
  default:
    currentConfig = baseDevConfig;
    currentConfigFileName = '.env';
    break;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: currentConfigFileName,
      load: [currentConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class CanConfigModule {}

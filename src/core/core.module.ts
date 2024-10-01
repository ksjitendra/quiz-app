import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { CanConfigModule } from './config/config.module';

@Module({
  imports: [DbModule, CanConfigModule]
})
export class CoreModule {}

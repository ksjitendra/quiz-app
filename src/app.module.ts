import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [CommonModule, CoreModule, QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module, Provider } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { UtilsModule } from '../common/utils/utils.module'
import { QuizProviders } from './quiz.repositories';

@Module({
  imports: [UtilsModule],
  controllers: [QuizController],
  providers: [QuizService, ...(QuizProviders as Provider[])],
})
export class QuizModule {}

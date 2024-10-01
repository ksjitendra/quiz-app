import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { UtilsService } from 'src/common/utils/utils.service';
import { addQuestionDto, addQuizDto, ResultDto, saveAnswerDto } from './dto/quiz.dto';
import { query, response } from 'express';


@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly utilsService: UtilsService
    
  ) {}

  // API to create new quiz
  @Post('/create')
  async createQuiz(@Body() payload: addQuizDto, @Res() response): Promise<void> {
    const res = await this.quizService.saveQuiz(payload)
    this.utilsService.sendResponse(response, res.status, res.data, res.message, res.error)
  }

  // API to create question 
  @Post('/create/question') 
  async createQuestion(@Body() payload: addQuestionDto, @Res() response) : Promise<void> {
    const res = await this.quizService.saveQuestion(payload)
    this.utilsService.sendResponse(response, res.status, res.data, res.message, res.error)
  }

  // API for the quiz questions
  @Get('info/:quizId')
  async getQuizQuestions(@Param('quizId') quizId, @Res() response ): Promise<void> {
    const res = await this.quizService.getQuestions(quizId)
    this.utilsService.sendResponse(response, res.status, res.data, res.message, res.error)
  }

  // API to save answers for any question 
  @Post('/save/answer')
  async saveAnswers(@Body() payload: saveAnswerDto, @Res() response) : Promise<void> {
    const res = await this.quizService.saveAnswers(payload)
    this.utilsService.sendResponse(response, res.status, res.data, res.message, res.error)
  }

  // API to get score for any quiz for any user
  @Get('/result')
  async getResults(@Res() response, @Query() payload: ResultDto) : Promise<void> {
    console.log("payload",payload);
    const res = await this.quizService.getResults(payload)
    this.utilsService.sendResponse(response, res.status, res.data, res.message, res.error)
  }




 
}

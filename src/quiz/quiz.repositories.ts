import { type Provider } from "@nestjs/common";
import { Quiz } from "./models/quiz.model";
import { Question } from "./models/question.model";
import { Answer } from "./models/answer.model";
import { Result } from "./models/result.model";

export const QUIZ_REPOSITORY = 'QUIZ_REPOSITORY'
export const QUESTION_REPOSITORY = 'QUESTION_REPOSITORY'
export const ANSWER_REPOSITORY = 'ANSWER_REPOSITORY'
export const RESULT_REPOSITORY = 'RESULT_REPOSITORY'

export const QuizProviders: Provider[] = [
    {
        provide: QUIZ_REPOSITORY,
        useValue: Quiz
    },
    {
        provide: QUESTION_REPOSITORY,
        useValue: Question
    }, 
    {
        provide: ANSWER_REPOSITORY,
        useValue: Answer
    },
    {
        provide: RESULT_REPOSITORY,
        useValue: Result
    }
]
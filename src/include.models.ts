import {  Model, ModelCtor } from 'sequelize-typescript'
import { Quiz } from './quiz/models/quiz.model'
import { Question } from './quiz/models/question.model'
import { Answer } from './quiz/models/answer.model'
import { Result } from './quiz/models/result.model'

export const MODELS: ModelCtor<Model <any , any>>[] = [
    Quiz,
    Question,
    Answer,
    Result
]
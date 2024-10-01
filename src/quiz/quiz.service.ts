import { Injectable } from '@nestjs/common';
import { IfunctionReturnObject } from 'src/common/utils/utils.interface'; 
import { HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { QUIZ_REPOSITORY, QUESTION_REPOSITORY, ANSWER_REPOSITORY, RESULT_REPOSITORY } from './quiz.repositories';
import { Op } from 'sequelize';




import { Quiz } from './models/quiz.model';
import { Question } from './models/question.model';
import { Transaction } from 'sequelize';
import { Answer } from './models/answer.model';
import { Result } from './models/result.model';
import { DUPLICATE_ANSWER, ERROR_IN_FETCHING_QUESTIONS, ERROR_IN_RESULT_FETCH, ERROR_IN_SAVING_ANSWER, ERROR_IN_SAVING_QUESTION, ERROR_IN_SAVING_QUIZ, INVALID_QUESTION_REFERENCE, NO_QUESTIONS_FOUND, QUESTION_RETRIVED_SUCCESSFULLY, QUESTION_SAVED_SUCCESSFULLY, QUIZ_NOT_FOUND, QUIZ_SAVED_SUCCESSFULLY, RESULT_FETCHED, RIGHT_ANSWER } from 'src/common/constants/response.message';

@Injectable()
export class QuizService {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: typeof Quiz,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository : typeof Question,
    @Inject(ANSWER_REPOSITORY)
    private readonly answerRepository : typeof Answer,
    @Inject(RESULT_REPOSITORY)
    private readonly resultRepository : typeof Result
  ){}

  /**
   * Saves a new quiz to the database.
   *
   * @param {any} data - The quiz data that needs to be saved, including fields such as title, questions, etc.
   * @returns {Promise<IfunctionReturnObject>} - Returns an object containing the status, the latest quiz ID (if successful),
   *                                             or an error message (if unsuccessful).
   */
  async saveQuiz(data): Promise<IfunctionReturnObject> {

    try {
      const saveData = await this.quizRepository.create(data)
      const latestQuizId = saveData.id
      return { status: HttpStatus.OK, data: {latestQuizId}, message: QUIZ_SAVED_SUCCESSFULLY }
    } catch (error) {
      console.log('[Quiz Service] Error in saving quiz', error);
      return { status: HttpStatus.BAD_REQUEST, data: null, message: ERROR_IN_SAVING_QUIZ, error: error.message }
    }
  }

  /**
   * Saves a new question to the database.
   *
   * @param {any} questionData - The question data that needs to be saved, including fields such as questionTitle, options, correctOption, quizId.
   * @returns {Promise<IfunctionReturnObject>} - Returns an object containing the status, the latest question ID (if successful), or an error message (if unsuccessful).
   */
  async saveQuestion(questionData): Promise<IfunctionReturnObject> {
    const transaction: Transaction = await this.quizRepository.sequelize.transaction()
    try {

      const isQuizExist  = await this.quizRepository.findOne({
        where: {
          id: questionData.quizId
        }
      })

      if(!isQuizExist) {
        return { status: HttpStatus.BAD_REQUEST, data: null, message: QUIZ_NOT_FOUND }
      }

      const saveQuestion = await this.questionRepository.create(questionData, { transaction })
      const lastQuestionId = saveQuestion.id 

      await this.quizRepository.sequelize.query(
        `UPDATE quiz
        SET questions = json_insert(
            CASE 
                WHEN json_type(questions) = 'array' THEN questions
                ELSE '[]' 
            END, '$[#]', ?)
        WHERE id = ?`,
        {
            replacements: [lastQuestionId, questionData.quizId],
            transaction 
        }
    );

      transaction.commit()
      return { status: HttpStatus.OK, data: null, message: QUESTION_SAVED_SUCCESSFULLY }
    } catch (error) {
      transaction.rollback()
      console.log('[Quiz Service] Error in saving question', error);
      return { status: HttpStatus.BAD_REQUEST, data: null, message: ERROR_IN_SAVING_QUESTION, error: error.message }
      
    }
  }

  /**
   * Gets all the questions for a given quiz
   * @param quizId The id of the quiz for which questions needs to be fetched
   * @returns An object containing status, data and message. 
   *          Status would be 200 if successful, data would contain the array of questions, 
   *          message would be a success message. 
   *          If any error occurs, status would be 400, data would be null, 
   *          message would be an error message and error key would contain the actual error
   */
  async getQuestions(quizId) : Promise<IfunctionReturnObject> {
    try {

      const allQuestions = await this.questionRepository.sequelize.query(`
           select q.id as "questionId", q.question_title as "questionTitle", q.options
           from questions as q
           where q.id IN (
             select json_each.value
             FROM quiz, json_each(quiz.questions)
             WHERE quiz.id = :id
          )
        `, {
          replacements: {
            id: quizId
          }
        })

        if(allQuestions[0].length ==0 ) { 
          return { status: HttpStatus.BAD_REQUEST, data: null, message: NO_QUESTIONS_FOUND }
        }
      
        return { status: HttpStatus.OK, data: allQuestions[0], message: QUESTION_RETRIVED_SUCCESSFULLY }
    } catch (error) {
      console.log('[Quiz Service] Error in fetching quesitons', error);
      return { status: HttpStatus.BAD_REQUEST, data: null, message: ERROR_IN_FETCHING_QUESTIONS, error: error.message }
      
    }
  }

  /**
   * Saves the answer given by the user for a particular question and quiz and
   * updates the result in the database.
   * @param data The data which needs to be saved, which includes the questionId,
   * quizId, selectedOption and userId.
   * @returns An object containing status, data and message. 
   *          Status would be 200 if successful, data would contain the total correct answers, 
   *          message would be a success message. 
   *          If any error occurs, status would be 400, data would be null, 
   *          message would be an error message and error key would contain the actual error
   */
  async saveAnswers(data) : Promise<IfunctionReturnObject> {
    const transaction: Transaction = await this.quizRepository.sequelize.transaction()
    try {
      // check if user has already given answer for this question  or not 
      const isAnswerExist = await this.answerRepository.findOne({
        where: {
          userId : data.userId,
          questionId : data.questionId
        }
      })
      if(isAnswerExist) {
        return { status: HttpStatus.BAD_REQUEST, data: null, message: DUPLICATE_ANSWER }
      }

      // Getting quiz details based on the question id passed from the frontend
      const quizDetails : any = await this.quizRepository.sequelize.query(
        `SELECT quiz.id
         FROM quiz, json_each(quiz.questions)
         WHERE json_each.value = ?`,
        {
          replacements: [data.questionId],
        }
      );
      if(quizDetails[0].length == 0) {
        return { status: HttpStatus.BAD_REQUEST, data: null, message: INVALID_QUESTION_REFERENCE }
      }

      // checking if answer ius correct or not and saving in the db
      let isCorrect = false
      const isAnswerCorrect = await this.questionRepository.findOne({
        where: {
          id : data.questionId,
          correctOption : data.selectedOption
        }
      })
      if(isAnswerCorrect) {
        isCorrect = true
      }
      const saveAnswer = await this.answerRepository.create({
        questionId : data.questionId,
        selectedOption : data.selectedOption,
        isCorrect : isCorrect,
        userId : data.userId
      }, {transaction})


      // Saving result in the db based on the total correct answers
      const quizId = quizDetails[0][0].id      
      const allQuestions = await this.quizRepository.findOne({
        where: {
          id : quizId
        },
        attributes: ['questions']
      })
      const questionsIds = allQuestions.questions
      console.log('AllQuestionsId', allQuestions);
      const totalCorrectAnswers = await this.answerRepository.count({
        where: {
          userId : data.userId,
          questionId: {
            [Op.in] : questionsIds
          },
          isCorrect : true
        }
      })

      const prepareResultData = {
        userId : data.userId,
        quizId : quizId,
        score : totalCorrectAnswers,
      }

      const existingResult = await this.resultRepository.findOne({
        where: {
          userId: data.userId,
          quizId: quizId,
        },
        transaction,
      });

      if (existingResult) {
        // Update the existing result with the new score
        await this.resultRepository.update(
          { score: totalCorrectAnswers },
          {
            where: {
              userId: data.userId,
              quizId: quizId,
            },
            transaction,
          }
        );
      } else {
        // Record doesn't exist, so create a new entry
        await this.resultRepository.create(prepareResultData,
          { transaction }
        );
      }

      // preparing message for the user based on his/her answer 
      let message =''
      if(isCorrect) {
        message = RIGHT_ANSWER
      } else {

        const question = await this.questionRepository.findOne({
          where: {
            id : data.questionId
          },
          attributes: ['correctOption']
        })

        const correctOption = question.correctOption
        
        const questionData : any = await this.questionRepository.sequelize.query(`
           select q.id as "questionId" , JSON_EXTRACT(options, '$[${correctOption}]') AS "correctOption"
           from 
           questions as q
           where q.id = :questionId
          `, {
            replacements: {
              questionId: data.questionId,
              correctOption: correctOption
            }
          })

          message = `You have choosed wrong answer. Correct answer is ${questionData[0][0].correctOption}`
      }

      transaction.commit()
      return { status: HttpStatus.OK, data: totalCorrectAnswers, message }
    } catch (error) {
      transaction.rollback()
      console.log('[Quiz Service] Error in fetching quesitons', error);
      return { status: HttpStatus.BAD_REQUEST, data: null, message: ERROR_IN_SAVING_ANSWER, error: error.message }
      
    }
  }

  /**
   * This function fetches the results of a user in a quiz.
   * @param data - an object containing the quizId and userId
   * @returns a Promise resolving to an object containing the status, data and message.
   * The data object contains the quizTitle, score and questionsSummary.
   * The questionsSummary is an array of objects, each containing the question and answer.
   * The answer is either correct or incorrect.
   */
  async getResults(data) : Promise<IfunctionReturnObject> {
    try {
      const getData = await this.quizRepository.sequelize.query(`SELECT 
                    qz.title AS "quizTitle", 
                    r.score AS "score",
                    json_group_array(
                      json_object(
                        'question', qu.question_title,
                        'answer', CASE 
                          WHEN ans.is_correct = 1 THEN 'correct'
                          ELSE 'incorrect'
                        END
                      )
                    ) AS "questionsSummary"
                  FROM quiz AS qz
                  INNER JOIN results AS r ON qz.id = r.quiz_id
                  INNER JOIN json_each(qz.questions) AS qjson ON qjson.value = qjson.value
                  INNER JOIN questions AS qu ON qu.id = qjson.value
                  LEFT JOIN answers AS ans ON ans.question_id = qu.id AND ans.user_id = :userId
                  WHERE qz.id = :quizId AND r.user_id = :userId
                  GROUP BY qz.id, r.score`, {
          replacements: {
            quizId: data.quizId,
            userId: data.userId
          }
      })
      return { status: HttpStatus.OK, data: getData[0], message:RESULT_FETCHED }
    } catch (error) {
      console.log('[Quiz Service] Error in fetching results', error);
      return { status: HttpStatus.BAD_REQUEST, data: null, message: ERROR_IN_RESULT_FETCH, error: error.message }
    }
  }

}


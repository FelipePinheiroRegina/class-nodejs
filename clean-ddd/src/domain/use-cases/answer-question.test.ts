import { it, describe, expect } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { Answer } from '../entities/answer'

describe('AnswerQuestionUseCase', () => {
  it('should be able to answer a question', () => {
    const answerQuestionUseCase = new AnswerQuestionUseCase()
    const answer = answerQuestionUseCase.execute({
      instructorId: 'instructor-01',
      questionId: 'question-01',
      content: 'This is the answer',
    })

    expect(answer).toBeInstanceOf(Answer)
  })
})

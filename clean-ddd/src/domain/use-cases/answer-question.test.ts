import { AnswerQuestionUseCase, fakeAnswersRepository } from './answer-question'
import { Answer } from '../entities/answer'

describe('AnswerQuestionUseCase', () => {
  it('should be able to answer a question', async () => {
    const answerQuestionUseCase = new AnswerQuestionUseCase(
      fakeAnswersRepository,
    )
    const answer = await answerQuestionUseCase.execute({
      instructorId: 'instructor-01',
      questionId: 'question-01',
      content: 'This is the answer',
    })

    expect(answer).toBeInstanceOf(Answer)
  })
})

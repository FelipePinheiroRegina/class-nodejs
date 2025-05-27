import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to answer a question', async () => {
    const { answer } = await sut.execute({
      instructorId: 'instructor-01',
      questionId: 'question-01',
      content: 'This is the answer',
    })

    expect(answer).toBeInstanceOf(Answer)
  })
})

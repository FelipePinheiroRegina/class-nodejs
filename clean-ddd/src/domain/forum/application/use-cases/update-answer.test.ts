import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UpdateAnswerUseCase } from './update-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: UpdateAnswerUseCase

describe('Update Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new UpdateAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to update a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'content updated',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'content updated',
    })
  })
})

import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UpdateQuestionUseCase } from './update-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: UpdateQuestionUseCase

describe('Update Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new UpdateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to update a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'title updated',
      content: 'content updated',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'title updated',
      content: 'content updated',
    })
  })
})

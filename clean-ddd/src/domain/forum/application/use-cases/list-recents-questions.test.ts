import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ListRecentQuestionsUseCase } from './list-recent-questions'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ListRecentQuestionsUseCase

describe('List Recent Questions Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to list most recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2022, 0, 23),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 20),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 18),
      }),
    ])
  })

  it('should be able to list paginated most recent questions', async () => {
    for (let c = 1; c <= 22; c++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ createdAt: new Date(2022, 0, c) }),
      )
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2022, 0, 2),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 1),
      }),
    ])
  })
})

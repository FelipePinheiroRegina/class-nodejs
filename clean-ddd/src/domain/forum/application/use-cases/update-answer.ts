import { AnswersRepository } from '../repositories/answers-repository'

interface UpdateAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

// interface UpdateAnswerUseCaseResponse {}

export class UpdateAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: UpdateAnswerUseCaseRequest) /*: Promise<UpdateAnswerUseCaseResponse>*/ {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('answer not found.')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    answer.content = content

    await this.answersRepository.save(answer)
  }
}

import { QuestionsRepository } from '../repositories/questions-repository'

interface UpdateQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

// interface UpdateQuestionUseCaseResponse {}

export class UpdateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
  }: UpdateQuestionUseCaseRequest) /*: Promise<UpdateQuestionUseCaseResponse>*/ {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
  }
}

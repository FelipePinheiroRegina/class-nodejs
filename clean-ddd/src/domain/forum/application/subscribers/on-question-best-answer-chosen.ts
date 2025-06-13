import { DomainEvents } from '@/core/events/domain.events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '../../enterprise/events/answer-created-event'
import { AnswersRepository } from '../repositories/answers-repository'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { QuestionBestAnswerChosenEvent } from '../../enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.senQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async senQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Your answer was chosen as the best answer!`,
        content: `Your answer on the question "${question.title.substring(0, 20).concat('...')}" was chosen as the best answer.`,
      })
    }
  }
}

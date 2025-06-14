import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain.event'
import { DomainEvents } from './domain.events'

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.occurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
    it('should be able to dispatch and listen to events', () => {
        const callbackSpy = vi.fn()

        // Subscriber register (listener the answer created event)
        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        // I am creating a answer without save from database
        const aggregate = CustomAggregate.create()

        // I am certifying that the event was created but without saving it to the database
        expect(aggregate.domainEvents).toHaveLength(1)

        // I am saving the response in the database and thus triggering the event
        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        // The subscriber listens to the event and does what needs to be done with the information
        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})

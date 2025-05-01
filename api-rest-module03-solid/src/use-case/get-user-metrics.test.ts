import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
	beforeEach( async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)
	})

	it('should be able to get check-ins count from metrics', async () => {
		for (let count = 1; count <= 10; count++) {
			await checkInsRepository.create({
				gym_id: `gym-${count.toString().padStart(2, '0')}`,
				user_id: 'user-01'
			})
		}
		

		const { checkInsCount } = await getUserMetricsUseCase.execute({
			userId: 'user-01', 
		})

		expect(checkInsCount).toEqual(10)
	})
})
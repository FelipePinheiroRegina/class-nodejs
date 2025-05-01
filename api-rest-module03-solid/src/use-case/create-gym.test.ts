import { expect, it, describe, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		createGymUseCase = new CreateGymUseCase(gymsRepository)
	})

	it('should be able to create gym', async () => {
		const { gym } = await createGymUseCase.execute({
			title: 'Speed Fitness',
			description: null,
			phone: null,
			latitude: -22.3093407,
			longitude: -49.0041189,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
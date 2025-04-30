import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
	beforeEach( async () => {
		gymsRepository = new InMemoryGymsRepository()
		searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
	})

	it('should be possible to search for gyms by title', async () => {
		await gymsRepository.create({
			title: 'Speed Fitness',
			description: null,
			phone: null,
			latitude: -22.3093407,
			longitude: -49.0041189,
		})

		await gymsRepository.create({
			title: 'Sky Fitness',
			description: null,
			phone: null,
			latitude: -22.3093407,
			longitude: -49.0041189,
		})

		const { gyms } = await searchGymsUseCase.execute({ search: 'Sky Fitness', page: 1})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Sky Fitness'}),
		])
	})

	it('should be able to fetch paginated gyms search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `Gym ${i}`,
				description: null,
				phone: null,
				latitude: -22.3093407,
				longitude: -49.0041189,
			})
		}

		const { gyms } = await searchGymsUseCase.execute({
			search: 'Gym',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Gym 21'}),
			expect.objectContaining({ title: 'Gym 22'}),
		])
	})
})
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach( async () => {
		gymsRepository = new InMemoryGymsRepository()
		fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be possible to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Fitness',
			description: null,
			phone: null,
			latitude: -22.3218068,
			longitude: -49.070981
		})

		await gymsRepository.create({
			title: 'Near 2 Fitness',
			description: null,
			phone: null,
			latitude: -22.3218068,
			longitude: -49.070981
		})

		await gymsRepository.create({
			title: 'Near 3 Fitness',
			description: null,
			phone: null,
			latitude: -22.3218068,
			longitude: -49.070981
		})

		await gymsRepository.create({
			title: 'Far Fitness',
			description: null,
			phone: null,
			latitude:  -22.4195357,
			longitude: -49.1318629,
		})

		await gymsRepository.create({
			title: 'Far 2 Fitness',
			description: null,
			phone: null,
			latitude:  -22.4195357,
			longitude: -49.1318629,
		})

		const { gyms } = await fetchNearbyGymsUseCase.execute({ 
			userLatitude: -22.3218068,
			userLongitude: -49.070981
		})

		expect(gyms).toHaveLength(3)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Near Fitness'}),
			expect.objectContaining({ title: 'Near 2 Fitness'}),
			expect.objectContaining({ title: 'Near 3 Fitness'}),
		])
	})
})
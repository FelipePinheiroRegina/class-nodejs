import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Gym } from '@prisma/client'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase
let gymCreated: Gym

describe('Check In Use Case', () => {
	beforeEach( async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

		gymCreated = await gymsRepository.create({
			title: 'sky fit',
			latitude: 0,
			longitude: 0,
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		const { checkIn } = await checkInUseCase.execute({
			gymId: gymCreated.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await checkInUseCase.execute({
			gymId: gymCreated.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})

		await expect(() => checkInUseCase.execute({
			gymId: gymCreated.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await checkInUseCase.execute({
			gymId: gymCreated.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

		const {checkIn } = await checkInUseCase.execute({
			gymId: gymCreated.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Gym } from '@prisma/client'
import { CreateGymUseCase } from './create-gym'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase
let checkInUseCase: CheckInUseCase
let gymCreated: Gym

describe('Check In Use Case', () => {
	beforeEach( async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)
		createGymUseCase = new CreateGymUseCase(gymsRepository)

		const { gym } = await createGymUseCase.execute({
			title: 'sky fit',
			description: null,
			phone: null,
			latitude: -22.3218068,
			longitude: -49.070981,
		})

		gymCreated = gym

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
		})).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
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

		const { checkIn } = await checkInUseCase.execute({
			gymId: gymCreated.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		const { gym } = await createGymUseCase.execute({
			title: 'Speed Fitness',
			description: null,
			phone: null,
			latitude: -22.3093407,
			longitude: -49.0041189,
		})

		await expect(() => checkInUseCase.execute({
			gymId: gym.id,
			userId: 'user01',
			userLatitude: -22.3218068,
			userLongitude: -49.070981,
		})).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
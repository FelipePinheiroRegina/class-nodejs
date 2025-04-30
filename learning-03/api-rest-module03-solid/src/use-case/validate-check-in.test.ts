import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
	beforeEach( async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be possible to validate check-in', async () => {
		const { id } = await checkInsRepository.create({
			gym_id: 'gym01',
			user_id: 'user01',
		})

		const {checkIn} = await validateCheckInUseCase.execute({
			checkInId: id,
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.checkIns[0].validated_at).toEqual(expect.any(Date))
	})

	it('should not be possible to validate an inexistent check-in', async () => {
		await expect(() => validateCheckInUseCase.execute({
			checkInId: 'inexistent-check-in-id',
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		const { id } = await checkInsRepository.create({
			gym_id: 'gym01',
			user_id: 'user01',
		})

		const twentyOneMinutesInMs = 1000 * 60 * 21
		vi.advanceTimersByTime(twentyOneMinutesInMs)

		await expect(() => validateCheckInUseCase.execute({
			checkInId: id,
		})).rejects.toBeInstanceOf(LateCheckInValidationError)
	})

	// it('should not be able to check in on distant gym', async () => {
	// 	const { gym } = await createGymUseCase.execute({
	// 		title: 'Speed Fitness',
	// 		description: null,
	// 		phone: null,
	// 		latitude: -22.3093407,
	// 		longitude: -49.0041189,
	// 	})

	// 	await expect(() => checkInUseCase.execute({
	// 		gymId: gym.id,
	// 		userId: 'user01',
	// 		userLatitude: -22.3218068,
	// 		userLongitude: -49.070981,
	// 	})).rejects.toBeInstanceOf(MaxDistanceError)
	// })
})
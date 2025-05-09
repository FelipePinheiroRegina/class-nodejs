import { expect, it, describe, beforeEach } from 'vitest'
import bcryptjs from 'bcryptjs'
const { hash } = bcryptjs
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
	})

	it('should be able to get user profile', async () => {
		const userCreated = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await getUserProfileUseCase.execute({
			userId: userCreated.id
		})

		expect(user.name).toEqual('John Doe')
	})

	it('should not be able to get user profile with wrong id', async () => {
		await expect(() => getUserProfileUseCase.execute({
			userId: 'user-id-not-exists'
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
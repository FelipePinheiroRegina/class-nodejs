import { expect, it, describe, beforeEach } from 'vitest'
import bcryptjs from 'bcryptjs'
const { hash } = bcryptjs
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthUseCase } from './auth'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authUseCase: AuthUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		authUseCase = new AuthUseCase(usersRepository)
	})

	it('should be able to authenticate', async () => {
		usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await authUseCase.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() => authUseCase.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		})

		await expect(() => authUseCase.execute({
			email: 'johndoe@example.com',
			password: '123123',
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import bcryptjs from 'bcryptjs'
import { User } from '@prisma/client'
const {compare} = bcryptjs

interface AuthUseCaseRequest {
    email: string
    password: string
}

interface AuthUseCaseResponse {
    user: User
}

export class AuthUseCase {
	constructor(private usersRepository: UsersRepository){}

	async execute({email, password}: AuthUseCaseRequest): Promise<AuthUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if(!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatches = await compare(password, user.password_hash)

		if(!doesPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return {
			user
		}
	}
}
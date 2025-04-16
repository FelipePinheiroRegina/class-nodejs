import { UsersRepository } from '@/repositories/users-repository'
import bcryptjs from 'bcryptjs'
const { hash } = bcryptjs
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface UseCaseRequest {
    name: string,
    email: string,
    password: string
}

interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password
	}: UseCaseRequest): Promise<RegisterUseCaseResponse> {
		
		const password_hash = await hash(password, 6)
	
		const checkEmailAlreadyExists = await this.usersRepository.findByEmail(email)
	
		if(checkEmailAlreadyExists) {
			throw new UserAlreadyExistsError()
		}
		
		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		})

		return {
			user,
		}
	}
}


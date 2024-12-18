import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

interface UseCaseRequest {
    name: string,
    email: string,
    password: string
}

export async function registerUseCase({
    name,
    email,
    password
}: UseCaseRequest) {
    
	const password_hash = await hash(password, 6)

	const checkEmailAlreadyExists = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if(checkEmailAlreadyExists) {
		throw new Error('Email alreasy exists')
	}

	await prisma.user.create({
		data: {
			name,
			email,
			password_hash
		}
	})
}
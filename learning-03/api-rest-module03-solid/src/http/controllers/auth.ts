
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthUseCase } from '@/use-case/auth'
import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'


export async function auth(request: FastifyRequest, reply: FastifyReply) {
	const authBodySchema = z.object({
		email: z.string(),
		password: z.string().min(6)
	})

	const { email, password } = authBodySchema.parse(request.body)

	try {
		const usersRepository = new PrismaUsersRepository()
		const authUseCase = new AuthUseCase(usersRepository)
		await authUseCase.execute({
			email,
			password
		})

	} catch (err) {
		if(err instanceof InvalidCredentialsError) {
			return reply.status(400).send({message: err.message})
		}

		throw err
	}

	return reply.status(200).send()
}
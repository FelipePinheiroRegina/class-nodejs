
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from '@/use-case/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-case/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const bodySchema = z.object({
		name: z.string(),
		email: z.string(),
		password: z.string().min(6)
	})

	const { name, email, password } = bodySchema.parse(request.body)

	try {
		const registerUseCase = makeRegisterUseCase()

		await registerUseCase.execute({
			name,
			email,
			password
		})

	} catch (err) {
		if(err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({message: err.message})
		}

		throw err
	}

	return reply.status(201).send()
}
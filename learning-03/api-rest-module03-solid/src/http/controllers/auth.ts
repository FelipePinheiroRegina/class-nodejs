
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'
import { makeAuthUseCase } from '@/use-case/factories/make-auth-use-case'


export async function auth(request: FastifyRequest, reply: FastifyReply) {
	const authBodySchema = z.object({
		email: z.string(),
		password: z.string().min(6)
	})

	const { email, password } = authBodySchema.parse(request.body)

	try {
		const authUseCase = makeAuthUseCase()

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
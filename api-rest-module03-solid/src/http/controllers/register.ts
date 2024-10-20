
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { registerUseCase } from '@/use-case/register'


export async function register(request: FastifyRequest, reply: FastifyReply) {
	const bodySchema = z.object({
		name: z.string(),
		email: z.string(),
		password: z.string().min(6)
	})

	const { name, email, password } = bodySchema.parse(request.body)

	try {
		registerUseCase({
			name,
			email,
			password
		})

	} catch (err) {
		console.error(err)
		return reply.status(409).send()
	}


	return reply.status(201).send()
}
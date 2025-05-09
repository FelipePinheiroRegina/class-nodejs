import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/use-case/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInBodySchema = z.object({
		latitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.coerce.number().refine(value => {
			return Math.abs(value) <= 180
		}),
	})

	const createCheckInParamsSchema = z.object({
		gymId: z.string().uuid(),
	})

	const { gymId } = createCheckInParamsSchema.parse(request.params)
 	const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

	const checkInUseCase = makeCheckInUseCase()

	await checkInUseCase.execute({
		gymId,
		userId: request.user.sub,
		userLatitude: latitude,
		userLongitude: longitude,
	})

	return reply.status(201).send()
}
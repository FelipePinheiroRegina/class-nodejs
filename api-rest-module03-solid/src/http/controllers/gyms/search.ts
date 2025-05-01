import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-case/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const searchGymsQuerySchema = z.object({
		search: z.string(),
		page: z.coerce.number().min(1).default(1)
	})

	const { search, page } = searchGymsQuerySchema.parse(request.query)

	const searchGymsUseCase = makeSearchGymsUseCase()

	const { gyms } = await searchGymsUseCase.execute({
		search,
		page,
	})

	return reply.status(200).send({
		gyms,
	})
}
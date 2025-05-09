import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-case/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const fetchCheckInsHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1)
	})

	const { page } = fetchCheckInsHistoryQuerySchema.parse(request.query)

	const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

	const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
		userId: request.user.sub,
		page,
	})

	return reply.status(200).send({
		checkIns
	})
}
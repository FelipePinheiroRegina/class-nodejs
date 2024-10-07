import { FastifyRequest, FastifyReply } from "fastify"

export async function checkCookieUserId(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const user_id = request.cookies.user_id

    if(!user_id) {
        return reply.status(400).send('Anauthorized')
    }
}
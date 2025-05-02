import { FastifyInstance } from 'fastify'
import { register } from  './register'
import { auth } from './auth'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', auth)

	app.patch('/refresh/token', refresh)

	/** Authenticated */
	app.get('/me', { onRequest: [ verifyJWT ] }, profile)
}
import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, it } from 'vitest'

describe('Auth (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to auth', async () => {
		await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: '123456',
			})

		await request(app.server)
			.post('/sessions')
			.send({
				email: 'johndoe@example.com',
				password: '123456',
			}).expect((response) => response.statusCode === 200 && response.body.token)
	})
})
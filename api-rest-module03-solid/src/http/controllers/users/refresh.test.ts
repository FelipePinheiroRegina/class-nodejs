import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to refresh a token', async () => {
		await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email: 'johndoe@example.com',
				password: '123456',
			})

		const response = await request(app.server)
			.post('/sessions')
			.send({
				email: 'johndoe@example.com',
				password: '123456',
			})

		const cookies = response.get('Set-Cookie')
		await request(app.server)
			.patch('/refresh/token')
			.set('Cookie', cookies as string[])
			.send()
			.then((response) => {
				expect(response.statusCode).toEqual(200)
				expect(response.body).toEqual({
					token: expect.any(String),
				})
				expect(response.get('Set-Cookie')).toEqual([
					expect.stringContaining('refreshToken='),
				])			
			})
	})
})
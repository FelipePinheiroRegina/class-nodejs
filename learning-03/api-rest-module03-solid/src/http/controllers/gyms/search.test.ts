import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search a gym', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'js gym',
				description: 'Gym Description',
				phone: '123456789',
				latitude: -22.3093407,
				longitude: -49.0041189,
			})

		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'ts gym',
				description: 'Gym Description',
				phone: '123456789',
				latitude: -22.3093407,
				longitude: -49.0041189,
			})

		const response = await request(app.server)
			.get('/gyms/search')
			.query({
				search: 'js',
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'js gym',
			})
		])
	})
})
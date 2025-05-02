import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Near Gym',
				description: 'Gym Description',
				phone: '123456789',
				latitude: -22.3218068,
				longitude: -49.070981
			})

		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Far Gym',
				description: 'Gym Description',
				phone: '123456789',
				latitude:  -22.4195357,
				longitude: -49.1318629,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -22.3218068,
				longitude: -49.070981,
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Near Gym',
			})
		])
	})
})
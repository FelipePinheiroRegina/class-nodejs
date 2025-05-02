import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a gym', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		await request(app.server)
			.post('/gyms/create')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Gym Name',
				description: 'Gym Description',
				phone: '123456789',
				latitude: -22.3093407,
				longitude: -49.0041189,
			}).expect((response) =>  expect(response.statusCode).toEqual(201))
	})
})
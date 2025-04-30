import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a check-in', async () => {
		const { token } = await createAndAuthenticateUser(app)


		const { id: gymId } = await prisma.gym.create({
			data: {
				title: 'Gym Name',
				description: 'Gym Description',
				phone: '123456789',
				latitude: -22.3093407,
				longitude: -49.0041189,
			}
		})

		await request(app.server)
			.post(`/check-ins/${gymId}/create`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -22.3093407,
				longitude: -49.0041189,
			}).expect((response) =>  expect(response.statusCode).toEqual(201))
	})
})
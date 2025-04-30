import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('History Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list the history of check-ins', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: 'Gym Name',
				description: 'Gym Description',
				phone: '123456789',
				latitude: -22.3093407,
				longitude: -49.0041189,
			}
		})

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id
				},
				{
					gym_id: gym.id,
					user_id: user.id
				}
			]
		})

		await request(app.server)
			.get('/check-ins/history')
			.set('Authorization', `Bearer ${token}`)
			.send().then((response) =>  {
				expect(response.statusCode).toEqual(200)
				expect(response.body.checkIns).toHaveLength(2)
				expect(response.body.checkIns).toEqual([
					expect.objectContaining({
						gym_id: gym.id,
						user_id: user.id
					}),
					expect.objectContaining({
						gym_id: gym.id,
						user_id: user.id
					})
				])
			})
	})
})
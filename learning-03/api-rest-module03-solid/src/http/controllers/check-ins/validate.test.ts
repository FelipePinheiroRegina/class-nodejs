import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a check-in', async () => {
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

		const checkIn = await prisma.checkIn.create({
			data: 
				{
					gym_id: gym.id,
					user_id: user.id
				},
		})

		await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send().expect((response) =>  expect(response.statusCode).toEqual(204))

		const validatedCheckIn = await prisma.checkIn.findFirstOrThrow({
			where: {
				id: checkIn.id,
			}
		})
        
		expect(validatedCheckIn.validated_at).toEqual(expect.any(Date)) 
	})
})
import { Prisma, Gym } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
	async findById(id: string) {
		const gym = await prisma.gym.findUnique({
			where: { id }
		})

		return gym
	}

	async findManyNearby(params: FindManyNearbyParams) {
		const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * from gyms
            WHERE ( 6371 * acos( cos( radians(${params.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

		return gyms
	}

	async searchMany(search: string, page: number) {
		const gyms = await prisma.gym.findMany({
			where: { 
				title: {
					contains: search,
					mode: 'insensitive',
				}
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return gyms
	}

	async create(data: Prisma.GymCreateInput) {
		const gym = await prisma.gym.create({
			data, 
		})
        
		return gym
	} 
}
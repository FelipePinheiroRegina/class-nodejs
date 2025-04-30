import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
	private gyms: Gym[] = []

	async findById(id: string) {
		const gym = this.gyms.find(gym => gym.id === id)
		return gym || null
	}

	async findManyNearby(params: FindManyNearbyParams) {
		return this.gyms.filter(gym => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
			)

			return distance < 10
		})
	}

	async searchMany(search: string, page: number) {
		return this.gyms
			.filter((gym) => gym.title.includes(search))
			.slice((page - 1) * 20, page * 20)
	}

	async create(data: Prisma.GymCreateInput) {
		const gym: Gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? '',
			phone: data.phone ?? '',
			latitude: new Decimal(Number(data.latitude)),
			longitude: new Decimal(Number(data.longitude)),
		}
	
		this.gyms.push(gym)
		return gym
	}
}
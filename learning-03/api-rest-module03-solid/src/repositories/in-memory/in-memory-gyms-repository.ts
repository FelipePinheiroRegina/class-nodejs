import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymsRepository implements GymsRepository {
	private gyms: Gym[] = []

	async findById(id: string) {
		const gym = this.gyms.find(gym => gym.id === id)
		return gym || null
	}

	async create(data: Prisma.GymCreateInput) {
		const gym: Gym = {
			id: randomUUID(),
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
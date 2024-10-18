import fastify from 'fastify'
const app = fastify()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

prisma.user.create({
	data: {
		name: 'Felipe Pinheiro',
		email: 'felipe@email.com'        
	}
})
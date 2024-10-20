import fastify from 'fastify'
export const app = fastify()
import { AppRoutes } from './http/routes'

app.register(AppRoutes)
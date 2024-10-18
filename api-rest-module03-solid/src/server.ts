import fastify from 'fastify'
import { env } from './env'
const app = fastify()

app.listen({
	host: '0.0.0.0',
	port: env.SERVER_PORT
}).then(() => console.log('Server running', env.SERVER_PORT))
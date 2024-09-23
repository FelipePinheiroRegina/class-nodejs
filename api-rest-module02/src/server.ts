import { env } from './env/index'
import { app } from './app'

app
  .listen({ port: env.SERVER_PORT })
  .then(() => console.log('Server is running on: ', env.SERVER_PORT))

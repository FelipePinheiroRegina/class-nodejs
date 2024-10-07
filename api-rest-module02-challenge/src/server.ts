import { app } from "./app"
import { env } from "./env"


app.listen({
    port: env.SERVER_PORT
}).then(() => console.log('Server running on ', env.SERVER_PORT))
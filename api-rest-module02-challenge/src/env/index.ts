import { config } from "dotenv"
import { z } from "zod"

if(process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
} else {
    config()
}

const schemaEnvironment = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
    SERVER_PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string()
})

const _env = schemaEnvironment.safeParse(process.env)

if (_env.success === false) {
    console.error('Invalid environment variables', _env.error.format())

    throw new Error('Invalid environment variables.')
}

export const env = _env.data


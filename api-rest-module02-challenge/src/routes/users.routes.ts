import { FastifyInstance } from "fastify";
import { db } from "../database";
import { z } from "zod"
import { randomUUID } from "node:crypto"
import bcryptjs from 'bcryptjs'

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const checkTypeBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string()
        })
        
        const requestBody = checkTypeBody.safeParse(request.body)
       
        if (requestBody.success === false) {
            return reply.status(400).send({
                message: 'the body must contain the fields name, email, password, of type string'
            })
        }

        const { name, email, password } = requestBody.data

        // verify if user exists in database
        const emailExists = await db('users').where({ email }).first()
        if(emailExists) return reply.status(400).send({message: 'this email already exists, please, send a new email'})

        const hashPassword = await bcryptjs.hash(password, 8)

        await db('users').insert({
            id: randomUUID(),
            name,
            email,
            password: hashPassword
        })

        return reply.status(201).send({
            message: 'success'
        })
    })

    app.post('/sessions', async (request, reply) => {
        const checkTypeBody = z.object({
            email: z.string(),
            password: z.string()
        })

        const requestBody = checkTypeBody.safeParse(request.body)

        if(requestBody.success === false) {
            return reply.status(400).send({
                error: "User not found or missing fields"
            })
        }

        const { email, password } = requestBody.data

        const user = await db('users').where({ email }).first()

        const checkPassword = await bcryptjs.compare(password, user?.password)
        
        if(checkPassword === false) {
            return reply.status(400).send({
                error: "Email or password incorrects"
            })
        }

        const user_id = user?.id

        reply.cookie('user_id', user_id, {
            path: '/', // Aqui são as rotas que podem acessar esse cookie
            maxAge: 60 * 60 * 24 * 7, // 7 dias - clean code
        })

        return reply.status(204).send()
    })
}
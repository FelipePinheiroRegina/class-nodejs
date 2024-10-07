import { FastifyInstance } from "fastify";
import { checkCookieUserId } from "../middlewares/check_cookie_user_id";
import { boolean, string, z } from "zod";
import { db } from "../database";
import { randomUUID } from "crypto";

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async ( request, reply) => {
        checkCookieUserId
    })

    app.post('/',  async (request, reply) => {
        const user_id = request.cookies.user_id

        const checkTypeBody = z.object({
            name: z.string(),
            description: z.string(),
            inside_of_diet: z.boolean(),
        })

        const requestBody = checkTypeBody.safeParse(request.body)

        if(requestBody.success !== true) {
            return reply.status(400).send({error: 'Bad request'})
        }

        const { name, description, inside_of_diet } = requestBody.data
        
        await db('meals').insert({
            id: randomUUID(),
            name,
            description,
            inside_of_diet,
            user_id
        })
        
        return reply.status(204).send()
    }) 
    
    app.get('/', async (request, reply) => {
        const { user_id } = request.cookies

        const meals = await db('meals').where({ user_id })

        return reply.status(200).send(meals)
    })

    app.get('/:id', async (request, reply) => {
        const { user_id } = request.cookies
        
        const checkIdMeal = z.object({
            id: string().uuid()
        })

        const requestParams = checkIdMeal.safeParse(request.params)
        
        if(requestParams.success !== true) {
            return reply.status(400).send({error: 'Bad request'})
        }

        const { id } = requestParams.data
        
        const meal = await db('meals')
        .where({ 
            user_id,
            id
        }).first()

        if(!meal) return reply.status(204).send()

        return reply.status(200).send(meal)
    })

    app.put('/:id', async (request, reply ) => {
        const { user_id } = request.cookies
        
        const checkIdMeal = z.object({
            id: string().uuid()
        })

        const checkSchemaBody = z.object({
            name: string().optional(),
            description: string().optional(),
            inside_of_diet: boolean().optional(),
            created_at: string().optional()
        })

        const requestParams = checkIdMeal.safeParse(request.params)

        if(requestParams.success !== true) {
            return reply.status(400).send({error: 'Bad request'})
        }

        const { id } = requestParams.data

        const requestBody = checkSchemaBody.safeParse(request.body)

        if(requestBody.success !== true) {
            return reply.status(400).send({error: 'Bad request'})
        }

        const { name, description, inside_of_diet, created_at } = requestBody.data

        const oldMeal = await db('meals').where({
            user_id,
            id
        }).first()

        if(!oldMeal) return reply.status(404).send({error: 'Not found'})

        oldMeal.name           = name           ?? oldMeal?.name
        oldMeal.description    = description    ?? oldMeal?.description
        oldMeal.inside_of_diet = inside_of_diet ?? oldMeal?.inside_of_diet
        oldMeal.created_at     = created_at     ?? oldMeal?.created_at

        await db('meals').where({
            user_id,
            id
        }).update(oldMeal)

        return reply.status(204).send()
    })

    app.delete('/:id', async (request, reply) => {
        const { user_id } = request.cookies

        const checkIdparams = z.object({
            id: string().uuid()
        })

        const requestParams = checkIdparams.safeParse(request.params)

        if(requestParams.success !== true ) {
            return reply.status(400).send({error: 'Bad request'})
        }

        const { id } = requestParams.data 
        
        const response = await db('meals').where({
            user_id,
            id
        }).del()

        if(response === 0) {
            return reply.status(404).send({error: 'Not found'})
        }

        return reply.status(204).send()
    })

    app.get('/count', async (request, reply) => {
        const { user_id } = request.cookies

        const count = await db('meals')
        .where({ user_id })
        .count('* as count')
        .first()

        return reply.status(200).send(count)
    })

    app.get('/insideOfDiet', async (request, reply) => {
        const { user_id } = request.cookies

        const countInsideOfDiet = await db('meals').where({
            user_id,
            inside_of_diet: true
        }).count("inside_of_diet", { as: 'inside_of_diet'}).first()

        return reply.status(200).send(countInsideOfDiet)
    })

    app.get('/outsideOfDiet', async (request, reply) => {
        const { user_id } = request.cookies

        const countOutsideOfDiet = await db('meals').where({
            user_id,
            inside_of_diet: false
        }).count("inside_of_diet", { as: 'outside_of_diet'}).first()

        return reply.status(200).send(countOutsideOfDiet)
    })

    app.get('/bestSequence', async (request, reply) => {
        const { user_id } = request.cookies

        const meals = await db('meals').where({
            user_id
        }).select('inside_of_diet').orderBy('created_at')

        let bestSequence = 0;
        let auxCount     = 0;

        meals.forEach(meal => {
            if(meal.inside_of_diet === 1) {
                auxCount++

                if(auxCount > bestSequence) {
                    bestSequence = auxCount
                }
                
            } else {

                // se ele encontrar um false, zera a contagem
                auxCount = 0
            }
            
        })

        return reply.status(200).send({bestSequence})
    })
}
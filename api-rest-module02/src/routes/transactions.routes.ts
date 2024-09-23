import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  /* adiciona um middleware para todas as requisições
  app.addHook('preHandler', async (req, res) => {

  })
  */

  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const sessionId = req.cookies.sessionId

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return res.status(201).send({ transactions })
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const getTransactionsParamsSchemas = z.object({
      id: z.string().uuid(),
    })

    const sessionId = req.cookies.sessionId

    const { id } = getTransactionsParamsSchemas.parse(req.params)

    const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first()

    return res.status(201).send({ transaction })
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (req, res) => {
      const sessionId = req.cookies.sessionId

      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return res.status(201).send({ summary })
    },
  )

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/', // Aqui são as rotas que podem acessar esse cookie
        maxAge: 60 * 60 * 24 * 7, // 7 dias - clean code
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send()
  })
}

import { describe, beforeAll, afterAll, beforeEach, test, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe("Group tests of the router meals", () => {
    
    // bring up application
    beforeAll(async () => {
        await app.ready()
    })

    // bring down the application
    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test("Create a new meal", async () => {
        const name     = "New meal"
        const email    = "newmeal@email.com"
        const password = "123456"

        await request(app.server)
        .post('/users')
        .send({
            name,
            email,
            password
        }).expect(201)

        const responseSession = await request(app.server)
        .post('/users/sessions')
        .send({
            email,
            password
        }).expect(204)

        const cookie = responseSession.get('Set-Cookie')

        await request(app.server)
        .post('/meals')
        .set('Cookie', cookie)
        .send({
            name: "Whey protein",
            description: "Proteina do soro do leite",
            inside_of_diet: true
        }).expect(204)
    })
})

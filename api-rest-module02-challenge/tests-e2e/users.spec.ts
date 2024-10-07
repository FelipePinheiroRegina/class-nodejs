import { expect, describe, test, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'

describe("Group test of the router users", () => {
    // bring up the application
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

    test("Create a new user", async () => {
        await request(app.server)
        .post('/users')
        .send({
            name: 'Test end to end',
            email: "endtoend@email.com",
            password: "123456"
        })
        .expect(201)
    })

    test("Start a session", async () => {
        const name = 'New Session'
        const email = 'session@email.com'
        const password = '123456'
    
        await request(app.server)
        .post('/users')
        .send({
            name,
            email,
            password
        })
    
        const response = await request(app.server)
        .post('/users/sessions')
        .send({
            email,
            password
        })
    
        const cookie = response.get('Set-Cookie')
    
        // Verifica se o cookie foi definido
        expect(Array.isArray(cookie)).toBe(true)
        expect(cookie.length).toBeGreaterThan(0)
    
        // Verifica se o status da resposta está correto
        expect(response.statusCode).toBe(204)
        
        // Opcional: verifica se o cabeçalho Content-Type está correto
        expect(response.headers['content-type']).toBeUndefined() // 204 No Content não deve ter corpo
    })
})

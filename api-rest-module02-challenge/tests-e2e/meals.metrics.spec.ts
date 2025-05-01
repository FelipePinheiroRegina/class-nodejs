import { describe, beforeAll, afterAll, beforeEach, test, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe("Test group of a user's meal metrics", () => {
    
    // bring up application
    beforeAll(async () => {
        await app.ready()
    })

    // bring down the application
    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        try {
            execSync('npm run knex migrate:rollback --all');
        } catch (error) {
            // Ignorar erros relacionados à tentativa de reverter tabelas inexistentes
        }
        execSync('npm run knex migrate:latest');
    })

    test("Count total meals of user", async () => {
        const name     = "count tot"
        const email    = "count@email.com"
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

        const response = await request(app.server)
        .get('/meals/count')
        .set('Cookie', cookie)

        expect(response.body.count).toEqual(1)
    })

    test("Count total meals inside of diet", async () => {
        const name     = "count inside"
        const email    = "count@email.com"
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

        const array = [true, true, false, true]
    
        for(const boo of array) {
            await request(app.server)
            .post('/meals')
            .set('Cookie', cookie)
            .send({
                name: "Whey protein",
                description: "Proteina do soro do leite",
                inside_of_diet: boo
            }).expect(204)
        }

        const response = await request(app.server)
        .get('/meals/insideOfDiet')
        .set('Cookie', cookie)

        expect(response.body.inside_of_diet).toEqual(3) // existe 3 true dentro do array
    })

    test("Count total meals outside of diet", async () => {
        const name     = "count outside"
        const email    = "count@email.com"
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

        const array = [false, true, false, true]
    
        for(const boo of array) {
            await request(app.server)
            .post('/meals')
            .set('Cookie', cookie)
            .send({
                name: "Whey protein",
                description: "Proteina do soro do leite",
                inside_of_diet: boo
            }).expect(204)
        }

        const response = await request(app.server)
        .get('/meals/outsideOfDiet')
        .set('Cookie', cookie)

        expect(response.body.outside_of_diet).toEqual(2) // existe dois false dentro do array
    })

    test("Best sequence of user", async () => {
        const name     = "best sequence"
        const email    = "count@email.com"
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

        const array = [false, true, false, false, true, true, true, true, true]
    
        for(const boo of array) {
            await request(app.server)
            .post('/meals')
            .set('Cookie', cookie)
            .send({
                name: "Whey protein",
                description: "Proteina do soro do leite",
                inside_of_diet: boo
            }).expect(204)
        }

        const response = await request(app.server)
        .get('/meals/bestSequence')
        .set('Cookie', cookie)

        expect(response.body.bestSequence).toEqual(5) // a melhor sequencia deve ser 5
    })
})
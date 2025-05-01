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
        try {
            execSync('npm run knex migrate:rollback --all');
        } catch (error) {
            // Ignorar erros relacionados à tentativa de reverter tabelas inexistentes
        }
        execSync('npm run knex migrate:latest');
    });
    

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

    test("Update a meal", async () => {
        const name     = "Update meal"
        const email    = "update@email.com"
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

        const meals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

        const id = meals.body[0].id

        await request(app.server)
        .put(`/meals/${id}`)
        .set('Cookie', cookie)
        .send({
            name: "update",
            description: "update",
            inside_of_diet: false
        }).expect(204)
        
    })

    test("Index all meals", async () => {
        const name     = "Lista all"
        const email    = "list@email.com"
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

        const meals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)
        
        expect(meals.body).toBeInstanceOf(Array);
    })

    test("Show only a meal", async () => {
        const name     = "show only meal"
        const email    = "show@email.com"
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

        const meals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

        const id = meals.body[0].id

        const response = await request(app.server)
        .get(`/meals/${id}`)
        .set('Cookie', cookie)
        
        expect(meals.body).toBeInstanceOf(Object)
    })

    test("delete a meal", async () => {
        const name     = "delete a meal"
        const email    = "delete@email.com"
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

        const meals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

        const id = meals.body[0].id

        await request(app.server)
        .delete(`/meals/${id}`)
        .set('Cookie', cookie)
        .expect(204)
    })
})

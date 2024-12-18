import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary().notNullable().index(),
        table.text('name').notNullable(),
        table.text('description').notNullable(),
        table.boolean('inside_of_diet').notNullable(),
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())

        table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}


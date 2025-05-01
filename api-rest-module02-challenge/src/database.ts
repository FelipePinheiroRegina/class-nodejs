import knex from "knex";
import { Knex } from "knex";  // Importação separada para o tipo
import { env } from "./env";

export const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
      filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './db/migrations',
    }
};

export const db: Knex = knex(config);  // Tipagem explícita para 'db'

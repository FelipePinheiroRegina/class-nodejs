// eslint-disable-next-line
import { Knex } from "knex"

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
    },

    meals: {
      id: string,
      name: string,
      description: string,
      inside_of_diet: boolean,
      created_at: string,
      user_id: string
    }
  }
}

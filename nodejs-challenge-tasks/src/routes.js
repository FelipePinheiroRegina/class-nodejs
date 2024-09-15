import { buildPath } from "./utils/build-path.js"
import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
const database = new Database()

export const routes =  [
    {
        method: 'POST',
        path: buildPath('/tasks'),
        handler: (req, res, isCsv = false) => {
            if(req.body === null) {
                return res.writeHead(400).end("Insert a json body with the task title and description properties")
            }
            
            
            const { title, description } = req.body

            if(!title || !description) {
                return res.writeHead(400).end("Fields Required")
            }

            database.insert('tasks', {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            })
            
            if(isCsv) {
                return 'success'
            }

            return res.writeHead(204).end()
        }
    },

    {
        method: 'POST',
        path: buildPath('/importcsv'),
        handler: async (req, res) => {
            const { data } = req.body
            let isCsv
            if(!data) return res.writeHead(400).end()
            
            try {
                for (const row of data) {
                    req.body = row
                    await routes[0].handler(req, res, isCsv = true) 
                }

                res.writeHead(204).end()
            } catch (error) {
                res.writeHead(500).end()
            }  
        }
    },

    {
        method: 'GET',
        path: buildPath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const users = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(users)) 
        }
    },

    {
        method: 'PUT',
        path: buildPath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const response = database.update('tasks', id, {
                title,
                description
            })
            
            return res.writeHead(response.code).end()
        }
    },

    {
        method: 'DELETE',
        path: buildPath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const response = database.delete('tasks', id)
            
            return res.writeHead(response.code).end()
        }
    },

    {
        method: 'PATCH',
        path: buildPath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const response = database.patch('tasks', id)
            
            return res.writeHead(response.code).end()
        }
    }
    
]

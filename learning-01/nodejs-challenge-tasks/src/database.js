import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }


    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    select(table, search) {
        let data = this.#database[table] ?? []
    
        if (search) {
    
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
    
        return data
    } 

    update(table, id, newData) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            const newDataObj = {}

            if(newData.title) {
                newDataObj.title = newData.title
            }

            if(newData.description) {
                newDataObj.description = newData.description
            }

            newDataObj.updated_at = new Date()
            
            const oldData = this.#database[table][rowIndex]

            const updateData = Object.assign(oldData, newDataObj)

            this.#database[table][rowIndex] = updateData
            
            this.#persist()
            return {code: 204}
        }

        return {code: 404}
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
            return {code: 204}
        }

        return {code: 404}
    }

    patch(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            const response = this.#database[table][rowIndex].completed_at

            if(response === null) {
                this.#database[table][rowIndex].completed_at = true
            } else {
                this.#database[table][rowIndex].completed_at = null
            }
            
            return {code: 204}
        }

        return {code: 404}
    }
}
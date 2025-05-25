import { randomUUID } from 'node:crypto'

export class Question {
  public title: string
  public content: string
  public id: string

  constructor(title: string, content: string, id?: string) {
    this.id = id ?? randomUUID()
    this.title = title
    this.content = content
  }
}

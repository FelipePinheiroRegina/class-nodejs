export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   *  Receives a string and normalize it as a slug
   *
   * Example.: "An example title" => "an-example-title"
   *
   * @param text {string}
   */

  static createFromText(text: string) {
    const slugText = text
        .normalize('NFKD') 
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // remove white spaces
        .replace(/[^\w-]+/g, '') // get all that not is word
        .replace(/_/g, '-') // replace _ to -
        .replace(/--+/g, '-') // replace -- to -
        .replace(/-$/g, '') // if on final string have - replace to ''

        return new Slug(slugText)
    }
}

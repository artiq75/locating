export default class Singleton {
  static instance = null
  
  constructor() {
    if (Singleton.instance) {
      throw new Error(`Don't create new ${this.constructor.name}`)
    } else {
      Singleton.instance = this
    }
  }
}
import Form from './Form'
import Map from './Map'

class App {
  static map = null

  static form = null

  static #instance = null

  constructor() {
    if (App.#instance) {
      throw new Error('Not create new App instance')
    } else {
      App.#instance = this
    }
  }

  start() {
    App.form = new Form('dashboard-form')
    App.form.start()

    App.map = new Map()
    App.map.start()
  }
}

export default new App()
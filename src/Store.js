export default class Store {
  static store = []

  static add(value) {
    this.store = [...Store.store, value]
    document.dispatchEvent(new CustomEvent('store.add', {
      detail: this.store
    }))
  }
}
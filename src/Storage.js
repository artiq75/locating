export default class Storage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }

  static get(key) {
    return JSON.parse(localStorage.getItem(key))
  }
}

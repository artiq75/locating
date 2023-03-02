export default class Helper {
  static isEmpty(...args) {
    for (const arg of args) {
      if (!arg) return true
    }
    return false
  }

  static dispatchEvent(name, payload = null) {
    const event = new CustomEvent(name, {
      detail: payload
    })
    document.dispatchEvent(event)
  }
}

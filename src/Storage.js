export default class Storage {
  /**
   * @param {string} key
   * @param {any} value
   */
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  /**
   * @param {string} key 
   */
  static get(key) {
    return JSON.parse(localStorage.getItem(key))
  }  
}
export default class Block {
  /** @type {string} */
  type = ''

  /** @type {string} */
  className = ''

  /** @type {UIComponent[]} */
  children = []

  /** @param {string} className */
  constructor(type = 'div', className = '') {
    this.className = className
    this.type = type
  }

  /** @param {UIComponent} element */
  add(element) {
    this.children.push(element)

    return this
  }

  /** @returns {string} */
  render() {
    let html = `<${this.type} class="${this.className}">`
    for (const child of this.children) {
      if (child instanceof UIComponent) {
        html += child.render()
      } else {
        html += child
      }
    }
    return html += `</${this.type}>`
  }
}
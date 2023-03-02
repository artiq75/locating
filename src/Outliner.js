import { EventType } from "./constants"

export default class Outliner {
  start() {
    document.addEventListener(EventType.Render, this.render.bind(this))
  }

  render() {
    const fragment = document.createDocumentFragment()
    for (const state of getState()) {
      fragment.appendChild(this.newOutlinerItem(state))
    }
    this.outliner.replaceChildren(fragment)
  }

  newOutlinerItem(event) {
    const container = document.createElement('div')
    container.classList.add('outliner-item')
    container.dataset.id = event.id
    container.addEventListener('click', this.onOutlinerItemClick.bind(this))
    const title = container.appendChild(document.createElement('p'))
    title.innerText = event.title
    const cancel = container.appendChild(document.createElement('button'))
    cancel.classList.add('btn', 'btn-danger', 'small')
    cancel.innerText = 'x'
    return container
  }

  onOutlinerItemClick(e) {
    const id = e.target.dataset.id ?? e.target.parentNode.dataset.id
    if (e.target.tagName === 'BUTTON') {
      if (!confirm('Voulez-vous vraiment ?')) return
      setState(getState().filter((state) => state.id !== id))
    } else {
      this.outlinerItem = e.target
      this.isEdit = true
      const event = getState().find((state) => state.id === id)
      Helper.dispatchEvent(EventType.StateEdit, event)
      this.map.flyTo({
        center: [parseFloat(event.longitude), parseFloat(event.latitude)]
      })
    }
  }
}
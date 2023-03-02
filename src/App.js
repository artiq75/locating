import Singleton from './Singleton'
import Helper from './Helper'
import Map from './Map'
import { getState, setState, stateReducer } from './functions'
import { EventType, StateMutationType } from './constants'

const MAP_OPTIONS = Object.freeze({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4,
  clickTolerance: 10,
  doubleClickZoom: false,
  dragRotate: false
})

export default class App extends Singleton {
  map = {}

  isEdit = false

  outlinerItem = null

  constructor() {
    super()

    this.map = new Map(MAP_OPTIONS)

    this.form = document.getElementById('dashboard-form')
    this.outliner = document.getElementById('dashboard-outliner')
    this.formBtn = this.form.querySelector('button')
  }

  start() {
    this.map.on('load', this.onMapLoad)
    this.map.on('click', this.onMapClick.bind(this))

    this.form.addEventListener('submit', this.onSubmit.bind(this))

    document.addEventListener('click', this.onClick.bind(this))
    document.addEventListener(EventType.StateEdit, this.onStateEdit.bind(this))
    document.addEventListener(EventType.StateMutate, this.onStateMutate)
    document.addEventListener(EventType.Render, this.onRender.bind(this))
    document.addEventListener(
      EventType.FormSubmit,
      this.onFormSubmit.bind(this)
    )
  }

  onMapLoad() {
    Helper.dispatchEvent(EventType.Render)
  }

  onMapClick(e) {
    this.form.elements['latitude'].value = e.lngLat.lat
    this.form.elements['longitude'].value = e.lngLat.lng
  }

  onSubmit(e) {
    e.preventDefault()
    const formData = new FormData(this.form)
    formData.delete('id')
    if (Helper.isEmpty(...formData.values())) return
    const data = Object.fromEntries(new FormData(this.form))
    Helper.dispatchEvent(EventType.FormSubmit, data)
    this.form.reset()
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

  onClick(e) {
    if (
      this.outlinerItem &&
      !this.outlinerItem.contains(e.target) &&
      !this.form.contains(e.target) &&
      this.isEdit
    ) {
      e.preventDefault()
      this.isEdit = false
      this.form.elements['id'].value = ''
      this.form.elements['title'].value = ''
      this.form.elements['description'].value = ''
      document.removeEventListener(EventType.StateEdit, this.onStateEdit)
      this.formBtn.classList.remove('edit')
      this.formBtn.innerText = this.formBtn.dataset.default
    }
  }

  onStateEdit({ detail }) {
    for (const field in detail) {
      if (this.form.elements.namedItem(field)) {
        this.form.elements.namedItem(field).value = detail[field]
      }
    }
    this.formBtn.classList.add('edit')
    this.formBtn.innerText = "Modifier l'evenement"
  }

  onStateMutate({ detail }) {
    Helper.dispatchEvent(EventType.Render, detail)
  }

  onFormSubmit({ detail }) {
    const type = !detail.id ? StateMutationType.New : StateMutationType.Edit
    if (type === StateMutationType.Edit) this.formBtn.classList.remove('edit')
    stateReducer(type, detail)
  }

  onRender() {
    this.renderMapEvent()
    this.renderOutliner()
  }

  renderMapEvent() {
    this.map.getCanvasContainer().replaceChildren(this.map.getCanvas())
    for (const state of getState()) {
      this.map
        .newMarker({
          color: '#1E3348',
          lng: state.longitude,
          lat: state.latitude
        })
        .setPopup(this.map.newPopup().setHTML(this.getPopupHTML(state)))
    }
  }

  renderOutliner() {
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

  getPopupHTML(state) {
    return `<h2>${state.title}</h2>` + `<p>${state.description}</p>`
  }
}

import maplibregl from 'maplibre-gl'
import {
  trigger,
  getPopupHtml,
  getState,
  isEmpty,
  on,
  setState,
  stateReducer
} from './functions'
import { EventType, StateMutationType } from './constants'
import './css/index.scss'

const form = document.getElementById('dashboard-form')
const outliner = document.getElementById('dashboard-outliner')
const formBtn = form.querySelector('button')

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4
})

map.on('load', function () {
  trigger(EventType.Render)
})

map.on('click', function (e) {
  form.elements['latitude'].value = e.lngLat.lat
  form.elements['longitude'].value = e.lngLat.lng
})

form.addEventListener('submit', function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  formData.delete('id')
  if (isEmpty(...formData.values())) return
  const data = Object.fromEntries(new FormData(form))
  trigger(EventType.FormSubmit, data)
  form.reset()
})

on(EventType.FormSubmit, function (payload) {
  const type = !payload.id ? StateMutationType.New : StateMutationType.Edit
  stateReducer(type, payload)
})

on(EventType.StateMutate, function (payload) {
  trigger(EventType.Render, payload)
})

on(EventType.Render, function (e) {
  render()
})

let isReset = true

document.addEventListener('click', function () {
  if (!isReset) {
    form.reset()
  }
})

form.addEventListener('reset', function(e) {
  isReset = true
  formBtn.innerText = formBtn.dataset.default
})

on(EventType.StateEdit, function (payload) {
  isReset = false
  for (const field in payload) {
    if (form.elements.namedItem(field)) {
      form.elements.namedItem(field).value = payload[field]
    }
  }
  formBtn.innerText = "Modifier l'evenement"
})

function onOutlinerItemClick(e) {
  e.stopPropagation()
  const id = e.target.dataset.id ?? e.target.parentNode.dataset.id
  if (e.target.tagName === 'BUTTON') {
    if (!confirm('Voulez-vous vraiment ?')) return
    setState(getState().filter((state) => state.id !== id))
  } else {
    const event = getState().find((state) => state.id === id)
    trigger(EventType.StateEdit, event)
    flyTo(parseFloat(event.longitude), parseFloat(event.latitude))
  }
}

function render() {
  renderMapEvent()
  renderOutliner()
}

function renderMapEvent() {
  map.getCanvasContainer().replaceChildren(map.getCanvas())
  for (const event of getState()) {
    const popup = new maplibregl.Popup().setHTML(getPopupHtml(event))
    new maplibregl.Marker()
      .setLngLat({
        lng: event.longitude,
        lat: event.latitude
      })
      .setPopup(popup)
      .addTo(map)
  }
}

function renderOutliner() {
  const fragment = document.createDocumentFragment()
  for (const state of getState()) {
    fragment.appendChild(newOutlinerItem(state))
  }
  outliner.replaceChildren(fragment)
}

function newOutlinerItem(event) {
  const container = document.createElement('div')
  container.classList.add('outliner-item')
  container.dataset.id = event.id
  container.addEventListener('click', onOutlinerItemClick)
  const title = container.appendChild(document.createElement('p'))
  title.innerText = event.title
  const cancel = container.appendChild(document.createElement('button'))
  cancel.classList.add('btn', 'small')
  cancel.innerText = 'Annuler'
  return container
}

function flyTo(longitude, latitude) {
  map.flyTo({
    center: [longitude, latitude],
    essential: true,
    zoom: 7,
    speed: 1,
    curve: 1
  })
}

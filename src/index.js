import maplibregl from 'maplibre-gl'
import { getPopupHtml, getState, isEmpty, setState } from './functions'
import './css/index.scss'

const form = document.getElementById('dashboard-form')
const outliner = document.getElementById('dashboard-outliner')

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4
})

map.on('load', function () {
  document.dispatchEvent(new Event('render'))
})

map.on('click', function (e) {
  form.elements['latitude'].value = e.lngLat.lat
  form.elements['longitude'].value = e.lngLat.lng
})

form.addEventListener('submit', function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  if (isEmpty(formData.values())) return
  const data = Object.fromEntries(formData)
  const state = {
    id: crypto.randomUUID(),
    ...data
  }
  setState([state, ...getState()])
  form.reset()
})

document.addEventListener('state.mutate', function (e) {
  dispatchEvent('render', { detail: e.detail })
})

document.addEventListener('render', function (e) {
  render()
})

document.addEventListener('event.edit', function (e) {
  for (const field in e.detail) {
    if (form.elements.namedItem(field)) {
      form.elements.namedItem(field).value = e.detail[field]
    }
  }
  form.lastElementChild.innerText = 'Modifier'
})

function onOutlinerItemClick(e) {
  const id = e.target.dataset.id ?? e.target.parentNode.dataset.id
  switch (e.target.tagName) {
    case 'BUTTON':
      if (!confirm('Voulez-vous vraiment ?')) return
      setState(getState().filter((state) => state.id !== id))
      break
    default:
      const event = getState().find((state) => state.id === id)
      dispatchEvent('event.edit', event)
      flyTo(parseFloat(event.longitude), parseFloat(event.latitude))
      break
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

function dispatchEvent(name, payload) {
  let event = new Event(name)
  if (payload) {
    event = new CustomEvent(name, {
      detail: payload
    })
  }
  document.dispatchEvent(event)
}
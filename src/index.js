import maplibregl from 'maplibre-gl'
import { getPopupHtml, getState, isEmpty, setState } from './functions'
import './css/index.scss'

let removables = []

const form = document.getElementById('dashboard-form')

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4
})

map.on('load', function () {
  for (const state of getState()) {
    removables.push(newMapEvent(state))
  }
})

map.on('click', function (e) {
  form.elements['latitude'].value = e.lngLat.lat
  form.elements['longitude'].value = e.lngLat.lng
})

form.addEventListener('submit', function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  if (isEmpty(formData.values())) return
  document.dispatchEvent(
    new CustomEvent('form.submit', {
      detail: Object.fromEntries(formData)
    })
  )
  form.reset()
})

document.addEventListener('form.submit', function (e) {
  const data = e.detail
  const state = {
    id: crypto.randomUUID(),
    ...data
  }
  setState([state, ...getState()])
})

document.addEventListener('state.mutate', function (e) {
  for (const removable of removables) {
    removable.remove()
  }
  for (const state of e.detail) {
    removables.push(newMapEvent(state))
  }
})

document.addEventListener('click', function (e) {
  if (e.target.tagName !== 'BUTTON' && !e.target.dataset.id) return
  const id = e.target.dataset.id
  setState(getState().filter(state => state.id !== id))
})

function newMapEvent(data) {
  const popup = newMapPopup(data)
  const marker = newMapMarker(data).setPopup(popup)
  return {
    id: data.id,
    ...marker
  }
}

function newMapPopup(data) {
  return new maplibregl.Popup().setHTML(getPopupHtml(data))
}

function newMapMarker(data) {
  return new maplibregl.Marker()
    .setLngLat({
      lng: data.longitude,
      lat: data.latitude
    })
    .addTo(map)
}

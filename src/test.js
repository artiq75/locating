import maplibregl from 'maplibre-gl'
import './css/index.scss'

const form = document.getElementById('dashboard-form')

const STORAGE_EVENT_KEY = 'events'
const CUSTOM_EVENT_KEY = 'event'

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4,
  locale: 'fr'
})

let markers = []

document.addEventListener(CUSTOM_EVENT_KEY, function () {
  const events = getLocaleStorage(STORAGE_EVENT_KEY)
  markers.forEach((m) => {
    m.getPopup().remove()
    m.remove()
  })
  if (events && events.length) {
    events.forEach((event) => {
      const popup = new maplibregl.Popup().setHTML(event.html)
      const marker = new maplibregl.Marker()
        .setLngLat(event.coordinates)
        .setPopup(popup)
        .addTo(map)
      markers.push(marker)
    })
  }
})

document.dispatchEvent(new Event(CUSTOM_EVENT_KEY))

map
  .on('click', function (e) {
    const lngLat = e.lngLat
    if (form) {
      form.longitude.value = lngLat.lng
      form.latitude.value = lngLat.lat
    }
  })
  .addControl(new maplibregl.FullscreenControl())

form.addEventListener('submit', function (e) {
  e.preventDefault()

  const data = new FormData(form)
  data.append('id', crypto.randomUUID())

  if (!Array.from(data.values()).some(d => Boolean(d))) return null

  setState(getEvent(data))

  form.reset()
})

document.addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    let events = getLocaleStorage(STORAGE_EVENT_KEY)
    events = events.filter(event => event.id !== e.target.dataset.id)
    setLocaleStorage(STORAGE_EVENT_KEY, events)
    document.dispatchEvent(new Event(CUSTOM_EVENT_KEY))
  }
})

function setState(state) {
  const oldState = getLocaleStorage(STORAGE_EVENT_KEY) || []
  const data = [...oldState, state]
  setLocaleStorage(STORAGE_EVENT_KEY, data)
  document.dispatchEvent(new Event(CUSTOM_EVENT_KEY))
}

function getEvent(data) {
  return {
    id: data.get('id'),
    html: getHtml(data),
    coordinates: {
      lng: data.get('longitude'),
      lat: data.get('latitude')
    }
  }
}

function getHtml(data) {
  return (
    `<h2>${data.get('title')}</h2>` +
    `<p>${data.get('description')}</p>` +
    `<button class="event-remove-btn" data-id="${data.get('id')}">Supprimer</button>`
  )
}


import maplibregl from 'maplibre-gl'
import './css/index.scss'

const form = document.getElementById('dashboard-form')

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4
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
    new CustomEvent('event.submit', {
      detail: Object.fromEntries(formData)
    })
  )
  form.reset()
})

document.addEventListener('event.submit', function (e) {
  const data = e.detail
  new maplibregl.Marker().setLngLat([data.longitude, data.latitude]).addTo(map)
})

function isEmpty(args) {
  for (const arg of args) {
    if (!arg) return true
  }
  return false
}

// function getHtml(data) {
//   return (
//     `<h2>${data.get('title')}</h2>` +
//     `<p>${data.get('description')}</p>` +
//     `<button class="event-remove-btn" data-id="${data.get('id')}">Supprimer</button>`
//   )
// }

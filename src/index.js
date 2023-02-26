import maplibreGl from 'maplibre-gl';
import './styles.css'

const form = document.getElementById('dashboard-form')

const map = new maplibreGl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2, 47],
  zoom: 4,
  locale: 'fr'
});

map.on('click', function (e) {
  const lngLat = e.lngLat
  if (form) {
    form.longitude.value = lngLat.lng
    form.latitude.value = lngLat.lat
  }
})

form.addEventListener('submit', function (e) {
  e.preventDefault()
  const data = new FormData(form)
  if (data) {
    const uuid = crypto.randomUUID
  }
})
import mapboxgl from 'mapbox-gl'

export default class Map extends mapboxgl.Map {
  constructor(options) {
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN_KEY
    super(options)
  }

  newMarker(options = {}) {
    return new mapboxgl.Marker(options).setLngLat(options).addTo(this)
  }

  newPopup(options = {}) {
    return new mapboxgl.Popup(options)
  }

  flyTo(options) {
    super.flyTo({
      essential: true,
      zoom: 7,
      speed: 1,
      curve: 1,
      ...options
    })
  }
}

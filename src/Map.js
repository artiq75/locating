import maplibregl from 'maplibre-gl'

export default class Map {
  map = null
  
  markers = []

  constructor() {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [2, 47],
      zoom: 4
    })
  }

  start() {
    document.addEventListener('store.add', function (store) {
      markers.forEach(marker => {
        marker.getPopup().remove()
        marker.remove()
      });
      store.forEach((data) => {
        const marker = new maplibregl.Marker()
          .setLngLat(data.coordinate)
          .setPopup(new maplibregl.Popup().setHTML(this.getPopupHtml(data)))
          .addTo(this.map)
        this.markers.push(marker)
      })
    })
  }
  
  getPopupHtml(data) {
    return '<h2>' + data.title + '</h2>' + '<p>' + data.description + '</p>'
  }
}
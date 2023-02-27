import App from './App'
import Store from './Store'

export default class Form {
  element = null

  constructor(id) {
    this.element = document.getElementById(id)
  }
  
  start() {
    this.element.addEventListener('submit', this.onSubmit.bind(this))
    App.map.on('click', this.onClick.bind(this)) 
  }

  onClick(e) {
    console.log(e)
    this.element.longitude = e.lngLat.lng
    this.element.latitude = e.lngLat.lat
  }

  onSubmit(e) {
    e.preventDefault()
    const data = new FormData(this.element)
    
    Store.add({
      id: crypto.randomUUID(),
      title: data.get('title'),
      decription: data.get('description'),
      coordinates: {
        lng: data.get('longitude'),
        lat: data.get('latitude')
      }
    })

    this.element.reset()
  }
}

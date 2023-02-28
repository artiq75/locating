import maplibregl from 'maplibre-gl'

export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

export function isEmpty(args) {
  for (const arg of args) {
    if (!arg) return true
  }
  return false
}

export function getPopupHtml(data) {
  return (
    `<h2>${data.title}</h2>` +
    `<p>${data.description}</p>` +
    `<button class="event-remove-btn" data-id="${data.id}">annuler</button>`
  )
}

export function setState(state) {
  setStorage('state', state)
  document.dispatchEvent(
    new CustomEvent('state.change', {
      detail: state
    })
  )
}

export function getState() {
  return getStorage('state') || []
}


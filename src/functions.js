import { EventType, StateMutationType, StorageKey } from './constants'

export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

export function isEmpty(...args) {
  for (const arg of args) {
    if (!arg) return true
  }
  return false
}

export function getPopupHtml(data) {
  return `<h2>${data.title}</h2>` + `<p>${data.description}</p>`
}

export function setState(state) {
  trigger(EventType.StateMutate, setStorage(StorageKey.State, state))
}

export function getState() {
  return getStorage(StorageKey.State) || []
}

export function trigger(name, payload) {
  let event = new Event(name)
  if (payload) {
    event = new CustomEvent(name, {
      detail: payload
    })
  }
  document.dispatchEvent(event)
}

export function on(name, callback) {
  document.addEventListener(name, (e) => callback(e.detail))
}

export function stateReducer(type, payload) {
  let state = getState()
  switch (type) {
    case StateMutationType.New:
      state = [
        {
          ...payload,
          id: crypto.randomUUID()
        },
        ...state
      ]
      break
    case StateMutationType.Edit:
      state = state.map((state) => {
        if (state.id !== payload.id) return state
        return payload
      })
      break
    default:
      state
      break
  }
  setState(state)
}

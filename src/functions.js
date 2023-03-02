import { EventType, StateMutationType, StorageKey } from './constants'
import Storage from './Storage'
import Helper from './Helper'

export function getPopupHtml(data) {
  return `<h2>${data.title}</h2>` + `<p>${data.description}</p>`
}

export function setState(state) {
  Helper.dispatchEvent(
    EventType.StateMutate,
    Storage.set(StorageKey.State, state)
  )
}

export function getState() {
  return Storage.get(StorageKey.State) || []
}

export function stateReducer(type, detail) {
  let state = getState()
  switch (type) {
    case StateMutationType.New:
      state = [
        {
          ...detail,
          id: crypto.randomUUID()
        },
        ...state
      ]
      break
    case StateMutationType.Edit:
      state = state.map((state) => {
        if (state.id !== detail.id) return state
        return detail
      })
      break
    default:
      state
      break
  }
  setState(state)
}

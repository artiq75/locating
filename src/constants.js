export const EventType = Object.freeze({
  Render: 'render',
  StateMutate: 'state.mutate',
  StateEdit: 'state.edit',
  FormSubmit: 'form.submit'
})

export const StateMutationType = Object.freeze({
  New: 'new',
  Edit: 'edit'
})

export const StorageKey = Object.freeze({
  State: 'state'
})
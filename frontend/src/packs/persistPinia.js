export const customPersistPlugin = (context) => {
  if (!context.options.persist) return

  const expirationTime = 2 * 60 * 1000
  const savedState = JSON.parse(localStorage.getItem(context.options.persist.key) || '{}')

  if (savedState.timestamp && ((Date.now() - savedState.timestamp) <= expirationTime)) {
    context.store.$patch(savedState)
  } else {
    localStorage.removeItem(context.options.persist.key)
  }

  context.store.$subscribe((_, state) => {
    const dataToSave = {
      ...state,
      timestamp: Date.now()
    }
    localStorage.setItem(context.options.persist.key, JSON.stringify(dataToSave))
  })
}
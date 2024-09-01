export const info = (...params) => {
  if (process.env.NODE_ENV === 'test') return
  console.log(...params)
}

export const error = (...params) => {
  if (process.env.NODE_ENV === 'test') return
  console.error(...params)
}

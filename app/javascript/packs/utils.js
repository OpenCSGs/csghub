export const btoa_utf8 = (value) => {
  return btoa(
    String.fromCharCode(...new TextEncoder('utf-8').encode(value))
  )
}

export const atob_utf8 = (value) => {
  const binaryString = atob(value)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const decoder = new TextDecoder('utf-8')
  return decoder.decode(bytes)
}

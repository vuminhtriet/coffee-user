export function validateEmail (email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export function validateMinLength (text, min = 6) {
  if (!text || typeof text !== 'string' || text.length < min) {
    return false
  }
  return true
}

export function validatePhoneNumber (phone) {
  const re = /^[0-9]/
  return re.test(String(phone).toLowerCase())
}
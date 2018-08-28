import moment from 'moment'

export function formatCurrency (number, max) {
  try {
    if (number == null || isNaN(number) || typeof parseFloat(number) === 'NaN' || typeof parseInt(max) === 'NaN') { return 0 }

    const value = parseFloat(number)
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (max || -1) + '})?')
    const arrNum = noExponents(value).match(re)[0].split('.')

    const result = arrNum[0].toString().replace(/./g, function (c, i, a) {
      return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c
    })
    const num = (arrNum[1]) ? arrNum[1].substring(0, max).replace(/0+$/g, '') : ''
    const final = result + ((num !== '') ? '.' + num : '')
    return (final.includes('-')) ? '0' : final
  } catch (err) {
    return 0
  }
}

function noExponents (value) {
  const data = String(value).split(/[eE]/)
  if (data.length === 1) return data[0]

  let z = ''
  const sign = this < 0 ? '-' : ''
  const str = data[0].replace('.', '')
  let mag = Number(data[1]) + 1

  if (mag < 0) {
    z = sign + '0.'
    while (mag++) z += '0'
    return z + str.replace(/^\-/, '')
  }
  mag -= str.length
  while (mag--) z += '0'
  return str + z
}

export function millisecondsToMinutesSeconds (ms) {
  const duration = moment.duration(ms, 'milliseconds')
  const fromMinutes = Math.floor(duration.asMinutes())
  const fromSeconds = Math.floor(duration.asSeconds() - fromMinutes * 60)
  const fromMillisecond = Math.floor(ms - fromSeconds * 60 - fromMinutes * 60 * 60)

  return Math.floor(duration.asSeconds()) >= 60
  ? `${fromMinutes <= 9 ? `0${fromMinutes}` : fromMinutes}:${fromSeconds <= 9 ? `0${fromSeconds}` : fromSeconds}:${fromMillisecond}`
  : `00:${fromSeconds <= 9 ? `0${fromSeconds}` : fromSeconds}:${fromMillisecond}`
}

export function timestampToDatetime (timestamp) {
  var time = new Date(timestamp)
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var year = time.getFullYear()
  var month = months[time.getMonth()]
  var date = time.getDate()
  var hour = time.getHours()
  var minute = '0' + time.getMinutes()
  var second = '0' + time.getSeconds()

  var timeStr = hour + ':' + minute.substr(-2) + ' ' + date + '-' + month + '-' + year
  return timeStr
}

export function getInitials (name) {
  var initials = name.match(/\b\w/g) || []
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
  return initials
}

export function round (value, decimals = 2) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

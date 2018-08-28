import React, { PureComponent } from 'react'
import { Text } from 'react-native'

export const getFirstImgUrl = (images) => {
  if (images === null || images === undefined || images.length === 0) {
    return null
  }
  let image = images.find(item => item.type === 2)
  if (image) {
    return image.fullUrl
  }
  return images[0].fullUrl
}

export const getListImgUrl = (images = []) => {
  if (images === null || images === undefined || images.length === 0) {
    return null
  }
  const imgUrls = images.map(img => img.fullUrl)

  return imgUrls
}

export const countRatings = (ratings) => {
  const result = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  }
  ratings.map(item => {
    const value = item.value
    result[value] += 1
  })
  return result
}

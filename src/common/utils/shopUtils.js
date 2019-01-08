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

export const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d.toFixed(1);
}

export const deg2rad = (deg) => {
  return deg * (Math.PI/180)
}

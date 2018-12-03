import React, { PureComponent } from 'react'
import { Text } from 'react-native'

export const isFlashSaleProduct = (productPrices = []) => {
  if (!productPrices || productPrices.length === 0) {
    return { isFlashSale: false }
  }
  const newPrice = productPrices.find(item =>
    item.fromDate !== null &&
    item.toDate !== null
  )
  if (newPrice) {
    const oldPrice = productPrices.find(item =>
      item.cashUnitId === newPrice.cashUnitId &&
      item.electricUnitId === newPrice.electricUnitId
    )
    return { isFlashSale: true, newPrice, oldPrice }
  }
  return { isFlashSale: false }
}

export const formatCurrency = (price, currencyUnits) => {
  const cashUnit = price.cashUnitId ? currencyUnits.find(item => item.id === price.cashUnitId) : null
  const electricUnit = price.electricUnitId ? currencyUnits.find(item => item.id === price.electricUnitId) : null
  if (price.cashValue && price.electricValue) {
    return `${price.cashValue}${cashUnit.code} + ${price.electricValue}${electricUnit.code}`
  } else if (price.cashValue) {
    return `${price.cashValue}${cashUnit.code}`
  } else if (price.electricValue) {
    return `${price.electricValue}${electricUnit.code}`
  } else {
    return ''
  }
}

export const getTop2ActivePrice = (productPrices) => {
  const { isFlashSale, newPrice, oldPrice } = isFlashSaleProduct(productPrices)
  if (isFlashSale) {
    const activePrices = productPrices.filter(item => item.id !== oldPrice.id)
    return activePrices.length >= 2 ? activePrices.slice(0, 2) : activePrices
  } else {
    return productPrices.length >= 2 ? productPrices.slice(0, 2) : productPrices
  }
}

export const getActivePrices = (productPrices) => {
  const { isFlashSale, newPrice, oldPrice } = isFlashSaleProduct(productPrices)
  if (isFlashSale) {
    const acitvePrices = productPrices.filter(item =>
      JSON.stringify(item) !== JSON.stringify(oldPrice)
    )
    return acitvePrices
  } else {
    return productPrices
  }
}

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

export const showProductPrice = (price, currencyUnits) => {
  const cashUnit = price.cashUnitId ? currencyUnits.find(item => item.id === price.cashUnitId) : null
  const electricUnit = price.electricUnitId ? currencyUnits.find(item => item.id === price.electricUnitId) : null
  if (price.cashValue && !price.electricValue) {
    return <Text>{price.cashValue}<Text style={{ fontSize: 16 }}>{cashUnit.code}</Text></Text>
  } else if (!price.cashValue && price.electricValue) {
    return <Text>{price.electricValue}<Text style={{ fontSize: 16 }}>{electricUnit.code}</Text></Text>
  } else if (price.cashValue && price.electricValue) {
    return <Text>
      {price.cashValue}<Text style={{ fontSize: 16 }}>{cashUnit.code}</Text>
      {` + `}
      {price.electricValue}<Text style={{ fontSize: 16 }}>{electricUnit.code}</Text>
    </Text>
  } else {
    return ''
  }
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
    const rating = item.rating
    result[rating] += 1
  })
  return result
}

import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { Slider } from 'react-native-elements'
import moment from 'moment'
import { isFlashSaleProduct, formatCurrency, getFirstImgUrl } from '../../utils/productUtils'
import { SCREENS } from '../../screens'

const formatCurrencyFlashSale = (price, currencyUnits) => {
  const cashUnit = price.cashUnitId ? currencyUnits.find(item => item.id === price.cashUnitId) : null
  const electricUnit = price.electricUnitId ? currencyUnits.find(item => item.id === price.electricUnitId) : null
  if (cashUnit && !electricUnit) {
    return <Text>{price.cashValue}<Text style={{ fontSize: 14 }}>{cashUnit.code}</Text></Text>
  } else if (!cashUnit && electricUnit) {
    return <Text>{price.electricValue}<Text style={{ fontSize: 14 }}>{electricUnit.code}</Text></Text>
  } else if (cashUnit && electricUnit) {
    return <Text>
      {price.cashValue}<Text style={{ fontSize: 14 }}>{cashUnit.code}</Text>
      {` + `}
      {price.electricValue}<Text style={{ fontSize: 14 }}>{electricUnit.code}</Text>
    </Text>
  } else {
    return null
  }
}

class ProductFlashSaleDetail extends Component {
  onPress = () => {
    const { navigation, item } = this.props
    navigation.navigate(SCREENS.ProductDetail, { productItem: item })
  }

  render () {
    const { item, itemWith, currencyUnits } = this.props
    const { isFlashSale, newPrice, oldPrice } = isFlashSaleProduct(item.productPrices)
    const { images } = item
    if (!newPrice) {
      return null
    }
    const fullUrl = getFirstImgUrl(images)
    const fromDate = moment(newPrice.fromDate)
    const toDate = moment(newPrice.toDate)
    const now = moment(new Date())
    const percent = fromDate.diff(now) / fromDate.diff(toDate)

    return (
      <TouchableOpacity
        style={{
          width: itemWith,
          flexDirection: 'column',
          padding: 10,
          paddingBottom: 0
        }}
        onPress={this.onPress}
      >
        <View
          style={{
            position: 'absolute',
            zIndex: 999,
            right: 10,
            top: 10,
            width: 40,
            height: 40,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red'
          }}
        >
          <Text style={{ fontWeight: 'bold', color: 'white' }}>{newPrice.offPercent ? `-${newPrice.offPercent}%` : `-0%`}</Text>
        </View>
        {fullUrl
          ? <Image
            style={{ height: 160, width: '100%' }}
            source={{ uri: fullUrl }}
          /> : <Image
            style={{ height: 160, width: '100%' }}
            source={require('../../../assets/placeholder.png')}
          />
        }
        <View
          style={{ backgroundColor: '#1f89de', width: '100%', borderRadius: 5, paddingTop: 2, paddingBottom: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 16 }} numberOfLine={2}>
              {formatCurrencyFlashSale(newPrice, currencyUnits)}
            </Text>
          </View>
        </View>
        <Text style={{ marginBottom: 0, textAlign: 'center', paddingTop: 5, paddingBottom: 5, textDecorationLine: 'line-through', fontSize: 12 }}>
          {formatCurrency(oldPrice, currencyUnits)}
        </Text>
        <Slider
          disabled
          style={{ margin: 0, padding: 0, height: 24 }}
          thumbStyle={{ width: 0, height: 0 }}
          trackStyle={{ height: 6, backgroundColor: '#d3d3d3' }}
          value={percent}
          minimumTrackTintColor='#E64B47'
        />
        <Text style={{ marginBottom: 0, fontSize: 10 }}>
          {`By ${moment(newPrice.toDate).format('LLL')}`}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(ProductFlashSaleDetail)

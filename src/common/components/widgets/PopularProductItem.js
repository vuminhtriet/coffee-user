import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { SCREENS } from '../../screens'
import { getTop2ActivePrice, getFirstImgUrl } from '../../utils/productUtils'

function showPrices (price, index, currencyUnits) {
  const cashUnit = price.cashUnitId ? currencyUnits.find(item => item.id === price.cashUnitId) : null
  const electricUnit = price.electricUnitId ? currencyUnits.find(item => item.id === price.electricUnitId) : null
  return (
    <View
      key={index}
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      {
        cashUnit && electricUnit
          ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>
            {price.cashValue}<Text style={{ fontSize: 10 }}>{cashUnit ? cashUnit.code : ''}</Text> + {price.electricValue}<Text style={{ fontSize: 10 }}>{electricUnit ? electricUnit.code : ''}</Text>
          </Text>
          : cashUnit && !price.electricValue
            ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>{price.cashValue}<Text style={{ fontSize: 10 }}>{cashUnit ? cashUnit.code : ''}</Text></Text>
            : electricUnit && !price.cashValue
              ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>{price.electricValue}<Text style={{ fontSize: 10 }}>{electricUnit ? electricUnit.code : ''}</Text></Text>
              : null
      }
    </View>
  )
}

class PopularProductItem extends Component {
  onPress = () => {
    const { navigation, item } = this.props
    navigation.navigate(SCREENS.ProductDetail, { productItem: item })
  }

  render () {
    const { item, itemWith, itemHeight, currencyUnits } = this.props
    const { images } = item
    const fullUrl = getFirstImgUrl(images)

    return (
      <TouchableOpacity
        style={{
          width: itemWith,
          height: itemHeight,
          flexDirection: 'column',
          paddingHorizontal: 5,
          paddingBottom: 0
        }}
        onPress={this.onPress}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: '#D4D4D4',
            padding: 4,
            flex: 1
          }}
        >
          {fullUrl
            ? <Image
              style={{ height: 124, width: '100%' }}
              source={{ uri: fullUrl }}
            /> : <Image
              style={{ height: 124, width: '100%' }}
              source={require('../../../assets/placeholder.png')}
            />
          }
          <Text numberOfLines={2} style={{ marginTop: 5, marginBottom: 0, textAlign: 'center', paddingLeft: 5, paddingRight: 5 }}>
            {`${item.name}`}
          </Text>
          <View style={{
            marginBottom: 0,
            marginTop: 3,
            position: 'absolute',
            bottom: 3,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            {item.productPrices && getTop2ActivePrice(item.productPrices).map((price, index) => showPrices(price, index, currencyUnits))}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(PopularProductItem)

import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { Rating } from 'react-native-elements'
import { SCREENS } from '../../screens'
import Ion from 'react-native-vector-icons/Ionicons'
import { withNavigation } from 'react-navigation'
import { getTop2ActivePrice, getFirstImgUrl } from '../../utils/productUtils'

function showPrices(price, index, currencyUnits) {
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

class ProductItem extends Component {
  onPress = () => {
    const { item, navigation, onPress } = this.props
    if (onPress) {
      onPress(item)
    }
    else {
      navigation.navigate(SCREENS.ProductDetail, { productItem: item })
    }
  }

  render() {
    const { item, itemWith, itemHeight, currencyUnits } = this.props
    const { images } = item
    const fullUrl = getFirstImgUrl(images)
    return (
      <TouchableOpacity
        style={{
          width: itemWith,
          height: itemHeight,
          flexDirection: 'column',
          padding: 10,
          paddingBottom: 0
        }}
        onPress={this.onPress}
      >
        <View
          style={{
            padding: 5,
            borderWidth: 1,
            borderColor: '#D4D4D4',
            flex: 1
          }}
        >
          {fullUrl
            ? <Image
              style={{ height: 155 }}
              source={{ uri: fullUrl }}
            /> : <Image
              style={{ height: 155, width: '100%' }}
              source={require('../../../assets/placeholder.png')}
            />
          }
          <Text
            numberOfLines={2}
            style={{ fontSize: 16, marginBottom: 0, textAlign: 'left', marginTop: 10 }}
          >
            {`${item.name}`}
          </Text>
          <View
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              bottom: 0,
              left: 0,
              right: 0,
              paddingLeft: 6,
              paddingRight: 6
            }}
          >
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              {item.productPrices && getTop2ActivePrice(item.productPrices).map((prices, index) =>
                showPrices(prices, index, currencyUnits)
              )}
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View>
                  <Rating
                    type='custom'
                    fractions={1}
                    startingValue={item.averageRatingValue || 0}
                    readonly
                    imageSize={14}
                    showRating={false}
                    ratingImage={require('../../../assets/images/star.png')}
                    ratingColor='#FF6A00'
                    ratingBackgroundColor='transparent'
                    style={{ paddingVertical: 10 }} />
                </View>
                <View>
                  <Text style={{ marginBottom: 0, paddingTop: 7, textAlign: 'left' }}>
                    {` (${item.totalUserRating || 0})`}
                  </Text>
                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View style={{ marginTop: 1, marginRight: 2 }}>
                  {
                    item.isLike
                      ? <Ion name={'ios-heart'} style={{ paddingTop: 8, fontSize: 18, color: '#FF6A00' }} />
                      : <Ion name={'ios-heart'} style={{ paddingTop: 8, fontSize: 18, color: '#FF6A00' }} />
                  }
                </View>
                <View>
                  <Text style={{ marginBottom: 0, paddingTop: 7, textAlign: 'left' }}>
                    ({item.totalUserFavorite || 1})
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = state => ({
  currencyUnits: state['common'].units
})

export default connect(mapStateToProps)(withNavigation(ProductItem))
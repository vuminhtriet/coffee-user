import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import { Rating } from 'react-native-elements'
import Ion from 'react-native-vector-icons/Ionicons'

export default class ProductTitle extends Component {
  render () {
    const { productItem } = this.props

    if (!productItem) {
      return <View />
    }

    return (
      <View style={{
        paddingTop: 7,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
      }}>
        <Text numberOfLines = {2} style={{ fontWeight: 'bold', 
          fontSize: 18, paddingLeft: 3}}>
          {productItem && productItem.productName}
        </Text>
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
                startingValue={productItem.productTotalRating || 0}
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
                {` ${productItem.productTotalRating.toFixed(1) || 0}/5`}
              </Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ marginTop: 1, marginRight: 2, paddingTop: 3 }}>
              {/* <Ion name={'ios-heart'} style={{ fontSize: 22, color: '#FF6A00' }} /> */}
            </View>
            <View>
              <Text style={{ marginBottom: 0, paddingTop: 5, textAlign: 'left' }}>
                {/* ({productItem.totalUserFavorite || 1}) */}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

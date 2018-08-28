import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

export default class ProductShippingMethod extends Component {
  render () {
    const { shopInfo } = this.props
    const paymentMethod = shopInfo.shopPaymentMethods.map((item, index) => {
      return item.paymentType.name
    }).join(', ')
    return (
      <View style={{ marginTop: 7, paddingTop: 7, paddingBottom: 7, width: '100%', paddingLeft: 20, paddingRight: 20, backgroundColor: '#fff' }}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MaterialIcon
            name={'local-shipping'}
            size={20}
            style={{
              marginTop: 3,
              marginRight: 5,
              color: '#1f89de'
            }}
          />
          <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>Free ship with more than 1000$</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MaterialIcon
            name={'location-on'}
            size={20}
            style={{
              marginTop: 3,
              marginRight: 5,
              color: '#1f89de'
            }}
          />
          <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>Shipping from USA, Shipping to USA</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <MaterialIcon
            name={'payment'}
            size={20}
            style={{
              marginTop: 3,
              marginRight: 5,
              color: '#1f89de'
            }}
          />
          <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>Payment Method: {paymentMethod}</Text>
        </View>
      </View>
    )
  }
}

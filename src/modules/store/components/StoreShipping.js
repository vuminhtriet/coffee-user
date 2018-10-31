import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import {
  ListItem
} from 'react-native-elements'

export default class StoreShipping extends Component {
  render () {
    const { shop, shippingTypes } = this.props
    if (!shop) {
      return null
    }
    return (
      <View style={{
        marginTop: 7,
        paddingTop: 7,
        paddingBottom: 7,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
      }}>
        <Text style={{ fontSize: 16, paddingBottom: 3, color: '#000', fontWeight: 'bold' }}>
          Thông tin giao hàng
        </Text>
        <View>
          {shop.shopShippingTypes && shop.shopShippingTypes.map((item, index) => {
            const shippingType = shippingTypes.find(elem => elem.id === item.shippingTypeId)
            if (!shippingType) {
              return null
            }
            return (
              <ListItem
                key={index}
                title={shippingType.name}
                subtitle={item.description}
                hideChevron
                containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0, marginLeft: -10 }}
              />
            )
          })}
        </View>
      </View>
    )
  }
}

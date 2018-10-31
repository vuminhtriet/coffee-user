import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'

export default class OwnerShop extends Component {
  render () {
    const { productItem } = this.props

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
        <Text style={{ fontSize: 18, paddingBottom: 3, color: '#6F4E37' }}>Mô tả đồ uống</Text>
        <Text>
          {productItem.productDescription}
        </Text>
      </View>
    )
  }
}

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import { SCREENS } from '../../../common/screens'

export default class ShopInfo extends Component {
  render () {
    const { shopInfo, navigation } = this.props
    const { images } = shopInfo
    const logo = images && images.length > 0 ? images.find(item => item.type === 1) : undefined
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
        <View style={{ display: 'flex', flexDirection: 'row', height: 32 }}>
          <Text style={{ fontSize: 18, color: '#6F4E37' }}>Sold By</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SCREENS.StoreDetail, { id: shopInfo.id })
            }}
            style={{
              position: 'absolute',
              zIndex: 999,
              right: 0,
              top: 0,
              width: 100,
              height: 26,
              borderRadius: 3,
              borderColor: '#6F4E37',
              borderWidth: 1,
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Text
              style={{ color: 'red', textAlign: 'center' }}
            >
              Visit shop
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={{ width: 60 }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={{
                uri: !logo || !logo.fullUrl
                  ? 'https://facebook.github.io/react-native/docs/assets/favicon.png'
                  : logo.fullUrl
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text>{shopInfo.name}</Text>
            <Text>Online</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#D4D4D4', marginBottom: 10, marginTop: 10 }} />
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red', fontSize: 22 }}>{shopInfo.numberOfProducts || 0}</Text>
            <Text>Products</Text>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red', fontSize: 22 }}>{shopInfo.totalRating || 0}</Text>
            <Text>Ratings</Text>
          </View>
        </View>
      </View>
    )
  }
}

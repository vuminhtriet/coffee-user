import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Platform,
  StyleSheet,
  Text
} from 'react-native'
import { ListItem, List } from 'react-native-elements'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

export default class StoreLocationMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  render () {
    const { onBack, shop } = this.props
    const latlng = {
      latitude: shop && shop.shopLocation && shop.shopLocation.lat,
      longitude: shop && shop.shopLocation && shop.shopLocation.lng
    }

    return (
      <View style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        ...Platform.select({
          ios: ifIphoneX({
            paddingTop: 32
          }, {
            paddingTop: 20
          }),
          android: {
            paddingTop: 0
          }
        })
      }}>
        <View style={{ width: '100%' }}>
          <HeaderTitle onBack={onBack} title={`Bản đồ`} />
        </View>
        <View style={{ flex: 1 }} >
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{
            width: '100%',
            height: '100%'
          }}
          initialRegion={{
            latitude: shop && shop.shopLocation && shop.shopLocation.lat || 37.78825,
            longitude: shop && shop.shopLocation && shop.shopLocation.lng || -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={latlng}
            title={shop && shop.shopName}
            description={shop && shop.address && 
              `${shop.address.fullAddress}, ${isNaN(shop.address.districtName) ? '' : 'Quận '}${shop.address.districtName 
                || ''}, ${shop.address.cityName || ''}`}
          >
            {/* <View
              style={{
                alignContent: 'center',
                alignItems:'center',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#fff',
                width: 95,
                backgroundColor: '#6F4E37',
                flexDirection: 'column'
              }}
            > */}
              {/* <Text
              style={{
                textAlign:'center',
                color: '#fff',
                fontSize: 16
              }}
              >
                {shop && shop.shopName || ''}
              </Text>
              <Text
              style={{
                textAlign:'center',
                color: '#fff',
                fontSize: 16
              }}
              >
                {shop && shop.address && 
              `${shop.address.fullAddress}, ${shop.address.districtName || ''}, ${shop.address.cityName || ''}`}
              </Text> */}
            {/* </View> */}
          </Marker>
        </MapView>
        </View>
      </View>)
  }
}

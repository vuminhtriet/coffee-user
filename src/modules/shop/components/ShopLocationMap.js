import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Platform,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native'
import { ListItem, List } from 'react-native-elements'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

export default class ShopLocationMap extends Component {
  constructor (props) {
    super(props)
    const { address, lat, lng, shop } = this.props
    this.state = {
      refreshing: false,
      latlng: {
        latitude: shop && shop.shopLocation && shop.shopLocation.lat || 10.7735994,
        longitude: shop && shop.shopLocation && shop.shopLocation.lng || 106.6944173
      },
      currentAddress: '',
      data: {},
      isOutVN: false
    }
  }

  componentDidMount(){
    const { latlng, currentAddress, data } = this.state
    const { getLocation, address, setAddress, setLatlng, setDistrictCity, onBack, result } = this.props
    getLocation(latlng.latitude, latlng.longitude)
  }

  change = () => {
    const { latlng, currentAddress, data } = this.state
    const { getLocation, address, setAddress, setLatlng, setDistrictCity, onBack, result } = this.props
    Alert.alert(
      'Cập nhật vị trí',
      'Bạn có muốn cập nhật lại theo địa chỉ tham khảo?',
      [
        { 
          text: 'Không', onPress: () => { 
            setLatlng(latlng.latitude, latlng.longitude)
            onBack()
          } 
        },
        {
          text: 'OK', onPress: async () => {
            setLatlng(latlng.latitude, latlng.longitude)
            setAddress(result)
            setDistrictCity(result)
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  onDragEnd = (e) => {
    const { latlng, isOutVN } = this.state
    const { address, lat, lng, getLocation, shop, result } = this.props
    getLocation(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
    console.log("data", result)
    if(result && result.address_components) {
      result.address_components.map(component => {
        if(component.types[0] === "country"){
          if(component.short_name ==="VN"){
            this.setState({ 
              latlng: e.nativeEvent.coordinate
            })
          }
          else{
            this.setState({
              isOutVN: true
            })
          }
        }
      })
    }
    if(isOutVN){
      Alert.alert(
        'Không chọn được',
        'Vị trí bạn chọn nằm ngoài Việt Nam. Vui lòng chọn lại!',
        [
          {
            text: 'OK', onPress: async () => { this.setState({ latlng: {
              latitude: shop && shop.shopLocation && shop.shopLocation.lat || 10.7735994,
              longitude: shop && shop.shopLocation && shop.shopLocation.lng || 106.6944173,
              isOutVN: false
            } 
          })}
          }
        ],
        { cancelable: false }
      )
    }
  }

  render () {
    const { onBack, lat, lng, address, shop, result } = this.props
    const { currentAddress, latlng } = this.state
    // const latlng = {
    //   latitude: shop && shop.shopLocation && shop.shopLocation.lat,
    //   longitude: shop && shop.shopLocation && shop.shopLocation.lng
    // }

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
          <HeaderTitle 
            onBack={onBack} 
            title={`Bản đồ`} 
            rightIcon={
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  zIndex: 1,
                  height: 30,
                  borderColor: '#FFFFFF',
                  justifyContent: 'center'
                }}
                onPress={this.change}
                // disabled={disabled}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Xong</Text>
              </TouchableOpacity>
            }
          />
        </View>
        <View style={{ flex: 1 }} >
        <View style={{
          flexDirection: 'column',
          padding: 10
        }}>
          <Text style={{marginBottom: 5, flexDirection: 'row', color: '#33DAFF'}}>
            {'Địa chỉ hiện tại: '}
            <Text style={{color: 'black'}}>{address}</Text>
          </Text>
          <Text style={{marginBottom: 5, flexDirection: 'row', color: '#A2FF33'}}>
            {'Địa chỉ tham khảo: '}
            <Text style={{color: 'black'}}>{result.formatted_address || 'Bến Thành, Quận 1, Hồ Chí Minh, Vietnam'}</Text>
          </Text>
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{
            width: '100%',
            height: '100%'
          }}
          initialRegion={{
            latitude: latlng.latitude,
            longitude: latlng.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker draggable
            coordinate={latlng}
            // title={shop && shop.shopName}
            // description={shop && shop.address && shop.address.fullAddress}
            onDragEnd={(e) => this.onDragEnd(e)}
          />
        </MapView>
        </View>
        {/* <Button
          title='Cập nhật địa chỉ quán'
          backgroundColor='#E44C4C'
          onPress={this.submit}
          containerViewStyle={{ paddingVertical: 10 }}
          // disabled={disabled} 
        /> */}
      </View>)
  }
}

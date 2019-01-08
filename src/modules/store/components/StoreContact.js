import React, { Component } from 'react'
import {
  View,
  Text,
  Clipboard,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import call from 'react-native-phone-call'

export default class StoreContact extends Component {
  setClipboardContent = (msg) => {
    Clipboard.setString(msg);
    Alert.alert(
      '',
      'Đoạn chữ đã được sao chép.'
    )
  };

  call = (number) => {
    const args = {
      number: number, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    }
    call(args).catch(console.error)
  };


  render() {
    const { shop } = this.props
    // const address = shop.addresses && shop.addresses.length > 0 ? shop.addresses.find(address => address.isDefault == true) : {}
    const address = shop.address && shop.address.fullAddress ? 
    `${shop.address.fullAddress}, ${isNaN(shop.address.districtName) ? '' : 'Quận '}${shop.address.districtName 
      || ''}, ${shop.address.cityName || ''}`
    : 'No Address'
    return (
      <View style={{
        marginTop: 7,
        paddingTop: 7,
        paddingBottom: 7,
        width: '100%',
        paddingLeft: 10,
        paddingLeft: 10,
        backgroundColor: '#fff'
      }}>
        <Text style={{ fontSize: 16, paddingBottom: 3, color: '#000', fontWeight: 'bold' }}>
          Liên lạc
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'md-globe'}
            // type="material-community-icons"
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#ff6600'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(shop.website)}>
            <Text style={{ color: '#212121' }}>Website: </Text> 
            {shop.website || 'none'}
          </Text>
        </View>
        {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'logo-facebook'}
            // type="font-awesome"
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#1f89de'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(shop.facebookUrl)}>
            <Text style={{ color: '#212121' }}>Facebook:</Text> {shop.facebookUrl}
          </Text>
        </View> */}
        {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'md-at'}
            // type="entypo"
            size={20}
            style={{
              marginTop: 5,
              marginRight: 4,
              color: '#ff6600'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(shop.email)}>
            <Text style={{ color: '#212121' }}>Email:</Text> {shop.email}
          </Text>
        </View> */}
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'md-keypad'}
            // type="entypo"
            size={20}
            style={{
              marginTop: 5,
              marginRight: 6,
              marginLeft: 2,
              color: '#1f89de'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(shop.shopPhoneNumber)}>
            <Text style={{ color: '#212121' }}>SĐT: </Text> 
            {shop.shopPhoneNumber}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'ios-card'}
            // type="font-awesome"
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#ff6600'
            }}
          />
          <Text numberOfLines= {3} style={{ paddingLeft: 9, color: '#b5b5b5', 
          lineHeight: 22, fontSize: 14, marginRight: 25 }} 
          onPress={() => this.setClipboardContent(address)}>
            <Text numberOfLines= {3} style={{ color: '#212121' }}>Địa chỉ: </Text> 
            {address}
          </Text>
        </View>
      </View>
    )
  }
}

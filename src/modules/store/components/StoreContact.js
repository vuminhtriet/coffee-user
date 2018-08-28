import React, { Component } from 'react'
import {
  View,
  Text,
  Clipboard,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class StoreContact extends Component {
  setClipboardContent = (msg) => {
    Clipboard.setString(msg);
    Alert.alert(
      '',
      'Text has been already copied.'
    )
  };

  render() {
    const { shop } = this.props
    const address = shop.addresses && shop.addresses.length > 0 ? shop.addresses.find(address => address.isDefault == true) : {}
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
          Contact
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'ios-link'}
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#ff6600'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(shop.website)}>
            <Text style={{ color: '#212121' }}>Website:</Text> {shop.website}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'logo-facebook'}
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
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'ios-mail'}
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#ff6600'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(shop.email)}>
            <Text style={{ color: '#212121' }}>Email:</Text> {shop.email}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'ios-call'}
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#1f89de'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(address.phoneNumber)}>
            <Text style={{ color: '#212121' }}>Phone:</Text> {address.phoneNumber}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon
            name={'ios-paper'}
            size={20}
            style={{
              marginTop: 5,
              marginRight: 5,
              color: '#ff6600'
            }}
          />
          <Text style={{ paddingLeft: 10, color: '#b5b5b5', lineHeight: 22, fontSize: 14 }} onPress={() => this.setClipboardContent(address.fullAddress)}>
            <Text style={{ color: '#212121' }}>Address:</Text> {address.fullAddress}
          </Text>
        </View>
      </View>
    )
  }
}

import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Card,
  Icon,
  FormInput
} from 'react-native-elements'

export default class Shipment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      address: '',
      phone: ''
    }

    this.onChangeText = this.onChangeText.bind(this)
  }

  onChangeText (text, type) {
    const { onChangeShipmentInfo } = this.props
    this.setState({
      [type]: text
    })
    onChangeShipmentInfo && onChangeShipmentInfo({ type, text })
  }

  render () {
    const { shipment = {}, editable = false } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: undefined,
        height: undefined }}>
        <Text
          style={{ color: '#6F4E37', padding: 5, paddingVertical: 10, fontWeight: 'bold' }}>
          Shipping info
        </Text>
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 5,
              paddingHorizontal: 10
            }}
          >
            <Icon
              type='font-awesome'
              name='user-o'
            />
            {editable
              ? <FormInput
                value={shipment.name || ''}
                onChangeText={(text) => this.onChangeText(text, 'name')}
                placeholder='Receive name' />
              : <Text> {shipment.name} </Text>}
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 5,
              paddingHorizontal: 10
            }}
          >
            <Icon
              name='location-on'
            />
            {editable
              ? <FormInput
                value={shipment.address || ''}
                onChangeText={(text) => this.onChangeText(text, 'address')}
                placeholder='Receive address' />
              : (
                <Text style={{ flexWrap: 'wrap', flex: 1 }}>
                  {shipment.address}
                </Text>
              )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 5,
              paddingHorizontal: 10
            }}
          >
            <Icon
              name='call'
            />
            {editable
              ? <FormInput
                value={shipment.phone || ''}
                onChangeText={(text) => this.onChangeText(text, 'phone')}
                placeholder='Receive number phone' />
              : (
                <Text> {shipment.phone} </Text>
              )}
          </View>
        </View>
      </Card>
    )
  }
}

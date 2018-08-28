import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Card,
  Icon,
  FormLabel
} from 'react-native-elements'

export default class ShippingInfo extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { user, address } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Shipping info
        </FormLabel>
        <View style={{ flexDirection: 'column', paddingLeft: 10, paddingTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 10
            }}
          >
            <Icon
              type='font-awesome'
              name='user-o'
            />
            {user && <Text style={{ flex: 1 }}> {user.displayName}</Text>}
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 10
            }}
          >
            <Icon
              name='location-on'
            />
            {address && <Text style={{ flexWrap: 'wrap', flex: 1 }}>{address.fullAddress}</Text>}
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 10
            }}
          >
            <Icon
              name='call'
            />
            {address && <Text style={{ flex: 1 }}> {address.phoneNumber}</Text>}
          </View>
        </View>
      </Card>
    )
  }
}

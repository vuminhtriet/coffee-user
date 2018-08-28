import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Card,
  Icon,
  FormInput,
  FormLabel
} from 'react-native-elements'
import { isEmpty } from 'lodash'

export default class ShippingInfo extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { user, address, editable } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined
      }}>
        <View style={{ flexDirection: 'row' }}>
          <FormLabel
            containerStyle={{ padding: 0, margin: 0, flex: 1 }}
            labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
            Shipping address
          </FormLabel>
          <Icon
            name='edit'
            color='#6F4E37'
            containerStyle={{ paddingRight: 10, paddingTop: 10 }}
          />
        </View>
        <View style={{ flexDirection: 'column', paddingLeft: 10, paddingTop: 10 }}>
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
              size={16}
              containerStyle={{ paddingRight: 10 }}
            />
            {user && <Text style={{ flex: 1 }}> {user.displayName}</Text>}
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
              size={16}
              containerStyle={{ paddingRight: 10 }}
            />
            {address && !isEmpty(address.fullAddress) &&
              <Text style={{ flexWrap: 'wrap', flex: 1 }}>
                {address.country ? [address.fullAddress, address.country.name].join(', ') : address.fullAddress}
              </Text>}
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
              size={16}
              containerStyle={{ paddingRight: 10 }}
            />
            {address && <Text style={{ flex: 1 }}> {address.phoneNumber}</Text>}
          </View>
        </View>
      </Card>
    )
  }
}

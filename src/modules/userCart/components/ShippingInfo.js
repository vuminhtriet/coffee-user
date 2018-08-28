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

export default class ShippingInfo extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { user, editable = false } = this.props
    let { addresses } = user
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 18 }}>
          Shipping info
        </FormLabel>
        {
          (!addresses || addresses.length === 0)
          ? <View style={{ paddingLeft: 30, paddingTop: 10, paddingBottom: 10 }}><Text>Please update your shipping info!</Text></View>
          : <View style={{ flexDirection: 'column', paddingLeft: 10, paddingTop: 10 }}>
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
              {user && <Text> {user.displayName}</Text>}
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
              {addresses.length > 0 && <Text style={{ flexWrap: 'wrap', flex: 1 }}> {addresses[0].fullAddress}</Text>}
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
              {addresses.length > 0 && <Text> {addresses[0].phoneNumber}</Text>}
            </View>
          </View>
        }
      </Card>
    )
  }
}

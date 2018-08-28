import React, { Component } from 'react'
import {
  Text
} from 'react-native'
import {
  Card,
  FormLabel
} from 'react-native-elements'

export default class ShopNote extends Component {
  render () {
    const { note } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        paddingBottom: 80,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Shop's note
        </FormLabel>
        <Text
          style={{ height: 80, padding: 10, paddingLeft: 20 }}
        >
          {note}
        </Text>
      </Card>
    )
  }
}

import React, { Component } from 'react'
import {
  Card,
  ListItem,
  FormLabel
} from 'react-native-elements'

export default class Delivery extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const { delivery } = this.props
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
          Delivery methods
        </FormLabel>
        {delivery && (
          <ListItem
            title={delivery.shippingType.name}
            subtitle={delivery.description}
            leftIcon={{
              name: 'truck-delivery',
              type: 'material-community'
            }}
            hideChevron
            containerStyle={{ marginLeft: 10, marginRight: 10 }}
          />
        )}
      </Card>
    )
  }
}

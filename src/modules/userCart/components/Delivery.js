import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Card,
  ListItem,
  FormLabel
} from 'react-native-elements'

export default class Delivery extends Component {
  render () {
    const { selectItem, delivery, editable = false, shopShippingTypes } = this.props

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
          Delivery methods
        </FormLabel>
        {
          (!shopShippingTypes || shopShippingTypes.length === 0)
          ? <View style={{ marginLeft: 20, marginRight: 20, height: 30 }}><Text>No shipping types</Text></View>
          : shopShippingTypes.map((item, index) => {
            return (
              <ListItem
                containerStyle={{ marginLeft: 20, marginRight: 20 }}
                key={index}
                title={item.description}
                onPress={() => selectItem(item.id)}
                leftIcon={{
                  name: 'truck-delivery',
                  type: 'material-community'
                }}
                rightIcon={{
                  color: parseInt(item.id, 10) === delivery
                  ? 'green'
                  : undefined,
                  name: 'check'
                }}
            />
            )
          })}
      </Card>
    )
  }
}

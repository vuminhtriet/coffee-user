import React, { Component } from 'react'
import {
  Text
} from 'react-native'
import {
  Card,
  ListItem
} from 'react-native-elements'

export default class Delivery extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const { delivery, shopDeliveryMethods, editable = false, selecteDelivery } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: undefined,
        height: undefined }}>
        <Text
          style={{ color: '#6F4E37', padding: 5, fontWeight: 'bold' }}>
          Delivery methods
        </Text>
        {editable ? (
          shopDeliveryMethods.map((item, index) => {
            return (
              <ListItem
                key={index}
                title={item.name}
                onPress={() => selecteDelivery(item, index)}
                leftIcon={{
                  name: 'truck-delivery',
                  type: 'material-community'
                }}
                rightIcon={{
                  color: delivery.id === item.id
                  ? 'green' : undefined,
                  name: 'check'
                }}
              />
            )
          })
        ) : delivery && (
          <ListItem
            title={delivery.name}
            leftIcon={{
              name: 'truck-delivery',
              type: 'material-community'
            }}
          />
        )}
      </Card>
    )
  }
}

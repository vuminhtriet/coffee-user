import React, { Component } from 'react'
import {
  Text
} from 'react-native'
import {
  Card,
  ListItem,
  FormLabel
} from 'react-native-elements'

export default class Delivery extends Component {
  constructor (props) {
    super(props)
  }

  // componentDidMount () {
  //   const { getShopShippingTypes, shopId, token } = this.props
  //   shopId && token && getShopShippingTypes(shopId)
  // }

  render () {
    const { delivery, editable = false, shopShippingTypes, selectShopShippingType } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        paddingBottom: 10,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Delivery methods
        </FormLabel>
        {editable && shopShippingTypes.map(item => {
          return (
            <ListItem
              key={item.id}
              title={item.shippingType ? item.shippingType.name : ''}
              subtitle={item.description}
              onPress={() => selectShopShippingType(item.id)}
              rightIcon={{
                color: delivery === item.id
                  ? 'green'
                  : undefined,
                name: 'check'
              }}
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            />
          )
        })
        }
        {!editable && delivery && (
          <ListItem
            title={delivery.shippingType ? delivery.shippingType.name : ''}
            subtitle={delivery.description}
            hideChevron
            containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
          />
        )}
      </Card>
    )
  }
}

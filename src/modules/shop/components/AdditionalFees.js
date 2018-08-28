import React, { Component } from 'react'
import {
  Card,
  ListItem,
  FormLabel
} from 'react-native-elements'

export default class AdditionalFees extends Component {
  render () {
    const { fees } = this.props
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
          Additional fees
        </FormLabel>
        {fees && fees.map((item, index) => {
          return (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={item.description}
              rightTitle={`${item.value}${item.currencyUnit && item.currencyUnit.code}`}
              rightTitleStyle={{ color: '#000' }}
              hideChevron
              containerStyle={{ marginLeft: 10, marginRight: 10 }}
            />
          )
        })}
      </Card>
    )
  }
}

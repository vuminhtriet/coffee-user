import React, { Component } from 'react'
import {
  View,
  Platform
} from 'react-native'
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class DeliveryMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      type: null,
      error: undefined
    }

    this.addDeliveryMethod = this.addDeliveryMethod.bind(this)
  }

  async addDeliveryMethod () {
    const { token, shop, addShopDeliveryMethod, toggleShipping, shopShippingTypes } = this.props
    const { type, value } = this.state
    if (shopShippingTypes.some(item => {
      return (`${item.shippingTypeId}`.trim() === `${type}`.trim() &&
        `${item.description}`.trim() === `${value}`.trim()
      )
    })) {
      return this.setState({
        error: 'Duplicate delivery method.'
      })
    }
    await addShopDeliveryMethod(token, shop, {
      description: value,
      shippingTypeId: type
    })
    toggleShipping()
  }

  render () {
    const { error } = this.state
    const { toggleShipping, shippingTypes } = this.props
    return (
      <View style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        ...Platform.select({
          ios: ifIphoneX({
            paddingTop: 32
          }, {
            paddingTop: 20
          }),
          android: {
            paddingTop: 0
          }
        })
      }}>
        <View style={{ width: '100%' }}>
          <HeaderTitle title='Delivery method' onBack={toggleShipping} />
        </View>
        <Dropdown
          onChangeText={(value) => this.setState({ type: value, error: undefined })}
          label='Shipping type'
          data={shippingTypes.map(item => {
            return {
              value: item.id,
              label: item.name.toUpperCase()
            }
          })}
          containerStyle={{ marginHorizontal: 20 }}
        />

        <FormLabel>
          Desciption
        </FormLabel>
        <View style={{ width: undefined }}>
          <FormInput
            placeholder='Enter desciption'
            onChangeText={(value) => this.setState({ value, error: undefined })}
          />
        </View>
        {error && <FormValidationMessage>{
          error
        }</FormValidationMessage>}
        <Button
          title='ADD'
          containerViewStyle={{ marginVertical: 10 }}
          onPress={this.addDeliveryMethod} />
      </View>
    )
  }
}

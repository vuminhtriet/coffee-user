import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import { FormInput, Card, Button, FormValidationMessage } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class ProductPrice extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cash: '',
      cashType: {},
      crypto: '',
      cryptoType: {},
      errorCash: undefined,
      errorCrypto: undefined
    }
    this.addPrice = this.addPrice.bind(this)
    this.onSetUnit = this.onSetUnit.bind(this)
  }
  addPrice () {
    const { onAddPrice, productPrices } = this.props
    const { cash, crypto, cashType, cryptoType } = this.state
    if (!cash && !crypto) {
      return this.setState({
        errorCash: 'Must have cash or crypto price.'
      })
    }
    if (cash && !parseFloat(cash)) {
      return this.setState({
        errorCash: 'Invalid cash value.'
      })
    }
    if (cash && !cashType.id) {
      return this.setState({
        errorCash: 'Cash unit required.'
      })
    }
    if (crypto && !parseFloat(crypto)) {
      return this.setState({
        errorCrypto: 'Invalid crypto value.'
      })
    }
    if (crypto && !cryptoType.id) {
      return this.setState({
        errorCrypto: 'Crypto unit required.'
      })
    }
    if (productPrices.some(item => {
      const { origin } = item
      const itemCash = origin.cash || {}
      const itemCrypto = origin.crypto || {}
      return (itemCash.unit && itemCash.unit.id) === (cashType && cashType.id) &&
        (itemCrypto.unit && itemCrypto.unit.id) === (cryptoType && cryptoType.id)
    })) {
      return this.setState({
        errorCash: 'Duplicate unit not allow.'
      })
    }
    onAddPrice({
      flashSale: false,
      origin: {
        cash: cash && parseInt(cash) > 0 ? {
          value: cash,
          unit: cashType
        } : undefined,
        crypto: crypto && parseFloat(crypto) ? {
          value: crypto,
          unit: cryptoType
        } : undefined
      }
    })
  }
  onSetUnit (value, type = 'cash') {
    const { units } = this.props
    const unit = units.find(item => item.id === value)
    this.setState({
      [`${type}Type`]: unit,
      errorCash: undefined,
      errorCrypto: undefined
    })
  }
  render () {
    const { cash, crypto, cashType = {}, cryptoType = {}, errorCash, errorCrypto } = this.state
    const { units, onBack } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column', height: '100%' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle title='Add price' onBack={onBack} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <Card containerStyle={{
            margin: 0,
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: undefined,
            height: undefined
          }}>
            <Text style={{ fontSize: 12, color: '#808080' }}>
              Note: Please declare your payment methods to activate unit currencies accepted in your shop.
            </Text>
            <Text
              style={{ color: '#6F4E37', paddingVertical: 10, fontWeight: 'bold' }}>
              Display price: {parseFloat(cash) || parseFloat(crypto) !== 0
                ? [
                  { price: parseFloat(cash), type: cashType },
                  { price: parseFloat(crypto), type: cryptoType }].map(item => {
                    if (item.price && item.type && item.type.id) {
                      return `${item.price}  ${item.type.code || ''}`
                    }
                    return undefined
                  }).filter(item => item).join(' + ')
                : 0
              }
            </Text>
            <View style={{
              width: '100%',
              height: undefined
            }}>
              <View
                style={{
                  width: '100%',
                  height: 100,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 2, paddingTop: 25 }}>
                  <FormInput
                    value={cash}
                    placeholder='Enter cash value'
                    onChangeText={(cash) => this.setState({
                      cash,
                      errorCash: undefined,
                      errorCrypto: undefined
                    })}
                  />
                  {errorCash && <FormValidationMessage>{errorCash}</FormValidationMessage>}
                </View>
                <View style={{ flex: 1 }}>
                  <Dropdown
                    label='Unit'
                    data={units
                      .filter(item => item.type === 1)
                      .map(item => ({
                        value: item.id,
                        label: item.code
                      }))}
                    value={cashType.id}
                    containerStyle={{ marginHorizontal: 16 }}
                    onChangeText={(cashType) => this.onSetUnit(cashType, 'cash')}
                  />
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 100,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 2, paddingTop: 25 }}>
                  <FormInput
                    value={crypto}
                    placeholder='Enter crypto value'
                    onChangeText={(crypto) => this.setState({
                      crypto,
                      errorCash: undefined,
                      errorCrypto: undefined
                    })}
                  />
                  {errorCrypto && <FormValidationMessage>{errorCrypto}</FormValidationMessage>}
                </View>
                <View style={{ flex: 1 }}>
                  <Dropdown
                    value={cryptoType.id}
                    label='Unit'
                    data={units
                      .filter(item => item.type === 2)
                      .map(item => ({
                        value: item.id,
                        label: item.code
                      }))}
                    containerStyle={{ marginHorizontal: 16 }}
                    onChangeText={(cryptoType) => this.onSetUnit(cryptoType, 'crypto')}
                  />
                </View>
              </View>
            </View>
          </Card>
          <Button
            onPress={this.addPrice}
            title='Submit' containerViewStyle={{ paddingVertical: 10 }}
          />
        </View>
      </DefaultPage>
    )
  }
}

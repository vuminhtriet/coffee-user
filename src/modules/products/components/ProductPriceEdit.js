import React, { Component } from 'react'
import moment from 'moment'
import {
  View,
  Text
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import {
  FormValidationMessage,
  FormInput,
  Card,
  Button,
  CheckBox,
  FormLabel
} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class ProductPriceEdit extends Component {
  constructor(props) {
    super(props)
    const { price } = props
    const currentPrice = price.flashSale
      ? price.sales : price.origin
    this.state = {
      flashSale: price.flashSale || false,
      offPercent: price.offPercent,
      flashSaleDate: price.flashSaleDate || '',
      cash: currentPrice.cash ? currentPrice.cash.value : '',
      cashType: currentPrice.cash ? currentPrice.cash.unit : {},
      crypto: currentPrice.crypto ? currentPrice.crypto.value : '',
      cryptoType: currentPrice.crypto ? currentPrice.crypto.unit : {},
      errorCash: undefined,
      errorCrypto: undefined,
      errorDate: undefined
    }
    this.onSetUnit = this.onSetUnit.bind(this)
    this.editPrice = this.editPrice.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.enableFlashsale = this.enableFlashsale.bind(this)
  }
  enableFlashsale() {
    const { price } = this.props
    let {
      cash,
      crypto,
      flashSale
    } = this.state
    const currentPrice = price.origin

    if (!price.id) {
      return false
    }
    if (!flashSale) {
      if ((currentPrice.cash && cash >= currentPrice.cash.value) && !currentPrice.crypto) {
        return this.setState({
          errorCash: 'Flash sale cash price or crypto price must less than normal price.'
        })
      } else if ((currentPrice.crypto && crypto >= currentPrice.crypto.value) && !currentPrice.cash) {
        return this.setState({
          errorCrypto: 'Flash sale crypto price or cash price must less than normal price.'
        })
      } else if (currentPrice.cash && currentPrice.crypto &&
        crypto >= currentPrice.crypto.value && cash >= currentPrice.cash.value) {
        return this.setState({
          errorCash: 'Flash sale cash price or crypto price must less than normal price.',
          errorCrypto: 'Flash sale crypto price or cash price must less than normal price.'
        })
      }
    } else {
      cash = (currentPrice.cash && currentPrice.cash.value) || 0
      crypto = (currentPrice.crypto && currentPrice.crypto.value) || 0
      return this.setState({
        cash,
        crypto,
        flashSale: false,
        offPercent: 0
      })
    }
    const origin = price.origin
    const originCash = origin.cash
      ? parseInt(origin.cash.value) : 0
    const originCrypto = origin.crypto
      ? parseFloat(origin.crypto.value) : 0
    const offPercent = cash && crypto
      ? ((parseInt(cash) / originCash) + (parseFloat(crypto) / originCrypto)) / 2
      : cash
        ? (parseInt(cash) / originCash)
        : (parseFloat(crypto) / originCrypto)
    this.setState({
      errorCash: undefined,
      errorCrypto: undefined,
      errorDate: undefined,
      flashSale: !flashSale,
      offPercent: Math.round((1 - offPercent) * 100)
    })
  }
  editPrice() {
    const { onEditPrice, price } = this.props
    const { offPercent, cash, crypto, cashType, cryptoType, flashSale, flashSaleDate } = this.state
    const { origin } = price
    const currentPrice = price.origin
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
    if (flashSale) {
      if (!flashSaleDate || !`${flashSaleDate}`.trim()) {
        return this.setState({
          errorDate: 'Flash salde date required.'
        })
      }
      if ((currentPrice.cash && cash >= currentPrice.cash.value) && !currentPrice.crypto) {
        return this.setState({
          errorCash: 'Flash sale cash price or crypto price must less than normal price.'
        })
      } else if ((currentPrice.crypto && crypto >= currentPrice.crypto.value) && !currentPrice.cash) {
        return this.setState({
          errorCrypto: 'Flash sale crypto price or cash price must less than normal price.'
        })
      } else if (currentPrice.cash && currentPrice.crypto &&
        crypto >= currentPrice.crypto.value && cash >= currentPrice.cash.value) {
        return this.setState({
          errorCash: 'Flash sale cash price or crypto price must less than normal price.',
          errorCrypto: 'Flash sale crypto price or cash price must less than normal price.'
        })
      }
    }
    if (price.flashSale && !flashSale) {
      return onEditPrice({
        id: price.id,
        flashSale,
        flashSaleDate: null,
        offPercent: 0,
        origin: {
          cash: cash && parseInt(cash) > 0 ? {
            value: cash,
            unit: cashType
          } : undefined,
          crypto: crypto && parseFloat(crypto) > 0 ? {
            value: crypto,
            unit: cryptoType
          } : undefined
        },
        sales: null
      })
    }
    onEditPrice({
      id: price.id,
      flashSale,
      flashSaleDate,
      offPercent,
      origin: flashSale ? {
        ...origin
      } : {
          cash: cash && parseInt(cash) > 0 ? {
            value: cash,
            unit: cashType
          } : undefined,
          crypto: crypto && parseFloat(crypto) > 0 ? {
            value: crypto,
            unit: cryptoType
          } : undefined
        },
      sales: flashSale ? {
        cash: cash && parseInt(cash) > 0 ? {
          value: cash,
          unit: cashType
        } : undefined,
        crypto: crypto && parseFloat(crypto) > 0 ? {
          value: crypto,
          unit: cryptoType
        } : undefined
      } : null
    })
  }

  onSetUnit(value, type = 'cash') {
    const { units } = this.props
    const unit = units.find(item => item.id === value)
    this.setState({
      [`${type}Type`]: unit
    })
  }

  onValueChange(value, type) {
    const { price } = this.props
    const { flashSale, cash, crypto } = this.state
    let offPercent = 0
    let shouldFlashSale = flashSale
    if (flashSale) {
      const origin = price.origin
      const originCash = origin.cash
        ? parseInt(origin.cash.value) : 0
      const originCrypto = origin.crypto
        ? parseFloat(origin.crypto.value) : 0
      if (type === 'cash') {
        offPercent = (parseInt(value) / originCash) + (crypto ? (parseFloat(crypto) / originCrypto) : 0) / 2
      }
      else if (type === 'crypto') {
        offPercent = (parseFloat(value) / originCrypto) + (cash ? (parseInt(cash) / originCash) : 0) / 2
      }
      const sales = price.sales
      switch (type) {
        case 'cash':
          if (sales.cash && sales.cash.value < value) {
            shouldFlashSale = false
          }
          break
        case 'crypto':
          if (sales.crypto && sales.crypto.value < value) {
            shouldFlashSale = false
          }
          break
      }
    }
    this.setState({
      flashSale: shouldFlashSale,
      offPercent: Math.round((1 - offPercent) * 100),
      [type]: value && type === 'cash' ? `${parseInt(value)}` : value,
      [type === 'cash' ? 'errorCash' : 'errorCrypto']: undefined
    })
  }
  render() {
    const {
      flashSaleDate,
      flashSale,
      cash,
      crypto,
      errorDate,
      errorCash,
      offPercent,
      errorCrypto,
      cashType = {},
      cryptoType = {} } = this.state
    const { units, onBack, price } = this.props
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
            <Text
              style={{ color: '#6F4E37', paddingTop: 10, fontWeight: 'bold' }}>
              Display price: {parseFloat(cash) || parseFloat(crypto)
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
              {'\n'}
            </Text>
            <Text style={{ textDecorationLine: 'line-through', paddingLeft: 100 }}>
              {(price.origin.cash && parseFloat(price.origin.cash.value)) ||
                (price.origin.crypto && parseFloat(price.origin.crypto.value))
                ? [
                  price.origin.cash ? { price: parseFloat(price.origin.cash.value), type: price.origin.cash.unit } : {},
                  price.origin.crypto ? { price: parseFloat(price.origin.crypto.value), type: price.origin.crypto.unit } : {}].map(item => {
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
                    value={`${cash}`}
                    editable={price.origin.cash !== null}
                    placeholder='Cash value'
                    onChangeText={(cash) => this.onValueChange(cash, 'cash')}
                  />
                  {errorCash && <FormValidationMessage>{errorCash}</FormValidationMessage>}
                </View>
                <View style={{ flex: 1 }}>
                  <Dropdown
                    disabled
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
                    value={`${crypto}`}
                    editable={price.origin.crypto !== null}
                    placeholder='Crypto currency'
                    onChangeText={(crypto) => this.onValueChange(crypto, 'crypto')}
                  />
                  {errorCrypto && <FormValidationMessage>{errorCrypto}</FormValidationMessage>}
                </View>
                <View style={{ flex: 1 }}>
                  <Dropdown
                    disabled
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
            {price.id !== undefined && <CheckBox
              center
              title='Flash sale mode'
              iconRight
              onPress={this.enableFlashsale}
              checked={flashSale}
            />}
            {flashSale && <FormValidationMessage>Off: {offPercent} %</FormValidationMessage>}
            {flashSale && [
              <DatePicker
                key='date'
                style={{
                  marginHorizontal: 16,
                  width: undefined
                }}
                date={flashSaleDate}
                mode='datetime'
                placeholder='Ended date'
                format='LLL'
                minDate={moment().format('LLL')}
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                    position: 'absolute'
                  },
                  dateInput: {
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderColor: '#9C9C9C',
                    width: '100%'
                  },
                  placeholderText: {
                    textAlign: 'left',
                    width: '100%'
                  }
                }}
                onDateChange={(flashSaleDate) => this.setState({ flashSaleDate, errorDate: undefined })}
              />,
              errorDate
                ? <FormValidationMessage key='error'>{errorDate}</FormValidationMessage>
                : null,
              <FormLabel
                key='lable'
                containerStyle={{ paddingTop: 10 }}
              >
                If you choose flash sale, the origin price will be active again after the end date expire.
              </FormLabel>
            ]}
          </Card>
          <Button
            title='Submit'
            onPress={this.editPrice}
            containerViewStyle={{ paddingVertical: 10 }} />
        </View>
      </DefaultPage>
    )
  }
}

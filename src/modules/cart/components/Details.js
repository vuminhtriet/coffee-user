import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Alert
} from 'react-native'
import {
  Card,
  FormLabel,
  Avatar,
  Divider
} from 'react-native-elements'
import NumberInput from '../../../common/components/elements/NumberInput'
import { SCREENS } from '../../../common/screens'
import { withNavigation } from 'react-navigation'

class Details extends PureComponent {
  constructor(props) {
    super(props)
  }

  navigateProduct = (item) => {
    const { navigation, onBack } = this.props
    onBack && onBack()
    navigation.navigate(SCREENS.ProductDetail, { productItem: item })
  }

  renderItem = (item, index) => {
    const images = [...item.product.images]
    const isExistedCover = images.find(elem => elem.type === 2)
    const imageCover = isExistedCover
      ? isExistedCover
      : images.length > 0
        ? images[0]
        : null
    const { navigation } = this.props
    return (
      <View
        key={index}
        style={{
          width: undefined,
          height: undefined,
          flexDirection: 'row',
          margin: 15,
          paddingLeft: 5
        }}
      >
        <Avatar
          large
          source={imageCover
            ? { uri: imageCover.fullUrl }
            : require('../../../assets/placeholder.png')
          }
          onPress={() => this.navigateProduct(item.product)}
        />
        <View
          style={{
            flex: 1,
            height: 80,
            flexDirection: 'column',
            paddingHorizontal: 20,
            paddingVertical: 0
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {item.product.name}
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#E44C4C',
            fontWeight: 'bold'
          }}>
            {item.unitAmount}
          </Text>
          <Text>
            Options: {item.productVariation ? `${item.productVariation.name}` : 'This variation is unavailable'}
          </Text>
        </View>
        <View
          style={{
            height: 80,
            width: 45,
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            x{` ${item.quantity}`}
          </Text>
        </View>
      </View>
    )
  }

  renderEditableItem = (item, index) => {
    const { onQuantityChange, deleteProduct } = this.props
    const product = item.product.status === 1 ? item.product : null
    const price = item.price
    const promotionPrice = item.promotionPrice
    const priceUnitAmount = price
      ? item.cashUnit && item.electricUnit
        ? `${price.cashValue}${item.cashUnit.code} + ${price.electricValue}${item.electricUnit.code}`
        : item.cashUnit
          ? `${price.cashValue}${item.cashUnit.code}`
          : item.electricUnit
            ? `${price.electricValue}${item.electricUnit.code}`
            : ''
      : ''
    const promotionPriceUnitAmount = promotionPrice
      ? item.cashUnit && item.electricUnit
        ? `${promotionPrice.cashValue}${item.cashUnit.code} + ${promotionPrice.electricValue}${item.electricUnit.code}`
        : item.cashUnit
          ? `${promotionPrice.cashValue}${item.cashUnit.code}`
          : item.electricUnit
            ? `${promotionPrice.electricValue}${item.electricUnit.code}`
            : ''
      : ''
    const variant = item.productVariation
    const isExistCover = product && product.images && product.images.find(elem => elem.type === 2)
    const imageCover = isExistCover
      ? isExistCover
      : product && product.images && product.images.length > 0
        ? product.images[0]
        : null
    const quantity = parseInt(item.quantity)
    const { navigation } = this.props

    return (
      <View
        key={index}
        style={{
          width: undefined,
          height: undefined,
          flexDirection: 'row',
          margin: 15,
          paddingLeft: 5
        }}
      >
        <Avatar
          large
          source={imageCover
            ? { uri: imageCover.fullUrl }
            : require('../../../assets/placeholder.png')
          }
          onPress={() => this.navigateProduct(item.product)}
        />
        <View
          style={{
            flex: 1,
            height: undefined,
            flexDirection: 'column',
            paddingLeft: 20,
            paddingVertical: 0
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {item.product.name}
          </Text>

          {
            !product && <Text style={{
              fontSize: 20,
              color: '#E44C4C'
            }}>
              {'This product is not available'}
            </Text>
          }

          {
            (!price || !variant) && <Text style={{ color: '#E64B47' }}>Not for sale</Text>
          }

          {
            product && promotionPrice && <Text style={{
              fontSize: 16,
              color: '#E44C4C',
              fontWeight: 'bold'
            }}>
              {promotionPriceUnitAmount}
            </Text>
          }

          {
            product && price && <Text style={{
              fontSize: promotionPrice ? 14 : 16,
              color: promotionPrice ? '#9C9C9C' : '#E44C4C',
              textDecorationLine: promotionPrice ? 'line-through' : 'none',
              fontWeight: promotionPrice ? 'none' : 'bold'
            }}>
              {priceUnitAmount}
            </Text>
          }

          <NumberInput
            onChangeText={(value) => {
              const newQuantity = parseInt(value)
              if (!newQuantity) {
                variant.quantity >= 1 && onQuantityChange(item, 1)
              }
              else if (newQuantity === 0) {
                Alert.alert(
                  'Confirm',
                  'Do you want to remove this product from cart?',
                  [
                    { text: 'Cancel', onPress: () => { } },
                    {
                      text: 'OK', onPress: async () => {
                        deleteProduct(item)
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }
              else if (newQuantity < 0) {

              }
              else if (variant.quantity >= newQuantity) {
                onQuantityChange(item, newQuantity)
              }
              else if (variant.quantity < newQuantity) {
                Alert.alert(
                  'Warning',
                  'Your max quantity equals to variant quantity'
                )
              }
            }}
            onPlus={() => {
              const newQuantity = quantity + 1
              if (variant.quantity >= newQuantity) {
                onQuantityChange(item, newQuantity)
              }
              else {
                Alert.alert(
                  'Warning',
                  'Your max quantity equals to variant quantity'
                )
              }
            }}
            onMinus={() => {
              const newQuantity = quantity - 1
              if (newQuantity === 0) {
                Alert.alert(
                  'Confirm',
                  'Do you want to remove this product from cart?',
                  [
                    { text: 'Cancel', onPress: () => { } },
                    {
                      text: 'OK', onPress: async () => {
                        deleteProduct(item)
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }
              else if (newQuantity < 0) {

              }
              else {
                onQuantityChange(item, newQuantity)
              }
            }}
            value={`${quantity}`}
            containerStyle={{
              width: 150,
              paddingVertical: 5
            }}
          />

          {variant && variant.quantity === 0 && <Text style={{ color: '#E64B47' }}>Out of stock</Text>}
          {variant && variant.quantity !== 0 && variant.quantity < quantity && <Text style={{ color: '#E64B47' }}>Max quantity: {variant.quantity}</Text>}

          {variant && <Text style={{
            height: 20
          }}>
            Options: {variant.name}
          </Text>
          }
        </View>
      </View>
    )
  }

  render() {
    const { details, subTotalAmount, totalItem, editable = false, editDetails } = this.props
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
          Cart details
        </FormLabel>
        {!editable && details && details.map((item, index) => {
          return this.renderItem(item, index)
        })}
        {editable && editDetails && editDetails.map((item, index) => {
          return this.renderEditableItem(item, index)
        })}
        <Divider
          style={{
            backgroundColor: '#9C9C9C',
            height: 1,
            width: '120%',
            marginLeft: -20
          }} />
        <View
          style={{
            height: 50,
            width: undefined,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15
          }}
        >
          <Text
            style={{
              width: undefined,
              fontWeight: 'bold',
              paddingLeft: 5
            }}
          >
            Subtotal ({`${totalItem}`} items)
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            {`${subTotalAmount}`}
          </Text>
        </View>
      </Card>
    )
  }
}

export default withNavigation(Details)
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native'
import { withNavigation } from 'react-navigation'
import Ion from 'react-native-vector-icons/Ionicons'
import { CheckBox } from 'react-native-elements'
import { SCREENS } from '../../../common/screens'
import NumberInput from '../../../common/components/elements/NumberInput'
import { getActivePrices, formatCurrency, showProductPrice } from '../../../common/utils/productUtils'

const selectPriceOption = ({ index, priceSelected, price, onSelectProductPrice, currencyUnits }) => (
  <CheckBox
    key={index}
    containerStyle={{ backgroundColor: 'white' }}
    textStyle={{ fontSize: 16, paddingRight: 10, marginRight: 10 }}
    onPress={() => { onSelectProductPrice(price.id) }}
    checked={price.id === priceSelected}
    title={(price.fromDate !== null & price.toDate !== null)
      ? <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#43484d' }}>
            {formatCurrency(price, currencyUnits)}
            <Text style={{ color: '#E64B47' }}>{` (OFF -${price.offPercent}%)`}</Text>
          </Text>
        </View>
      : <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#43484d' }}>
            {formatCurrency(price, currencyUnits)}
          </Text>
        </View>
    }
  />
)

const selectProductVariants = ({ index, variantSelected, variant, onSelectProductVariant }) => (
  <CheckBox
    key={index}
    containerStyle={{ backgroundColor: 'white' }}
    textStyle={{ fontSize: 16, paddingRight: 10, marginRight: 10 }}
    onPress={() =>
      parseInt(variant.quantity, 10) > 0 && onSelectProductVariant(variant)
    }
    checked={variant.id === variantSelected.id}
    title={parseInt(variant.quantity, 10) > 0
      ? <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#43484d' }}>
            {variant.name}
          </Text>
        </View>
      : <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'grey' }}>
            {variant.name}
            <Text style={{ }}>{` (out of stock)`}</Text>
          </Text>
        </View>
    }
  />
)

class AddToCartPopup extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  goToCartPage = () => {
    const { navigation, onToggleAddToCart } = this.props

    onToggleAddToCart()
    setTimeout(() => {
      navigation.navigate(SCREENS.UserCart)
    }, 500);
  }

  addToCart = async (productItem, totalProductAdded, variantSelected, priceSelected) => {
    const {
      shopInfo,
      user,
      token,
      onAddToCart,
      navigation,
      onToggleAddToCart
    } = this.props
    if (token === null || token === '') {
      onToggleAddToCart()
      setTimeout(() => {
        navigation.navigate(SCREENS.AuthenticatePage)
      }, 500);
    }
    else if (variantSelected.quantity <= 0) {
      Alert.alert(
        'Warning',
        'This variation is out of stock',
        [
          { text: 'OK', onPress: () => { } }
        ]
      )
    }
    else {
      const response = await onAddToCart({
        user,
        shop: shopInfo,
        product: productItem,
        quantity: variantSelected.quantity < totalProductAdded
          ? variantSelected.quantity
          : totalProductAdded,
        variantId: variantSelected.id,
        priceId: priceSelected,
        token
      })
      if (response.success) {
        this.goToCartPage()
      }
      else {
        Alert.alert(
          'Error',
          `${response.message}`
        )
      }
    }
  }

  render() {
    const {
      productItem,
      onToggleAddToCart,
      totalProductAdded,
      onChangeProductAdded,

      currencyUnits,
      variantSelected,
      priceSelected,
      onSelectProductVariant,
      onSelectProductPrice
    } = this.props
    const isExistedCover = productItem && productItem.images && productItem.images.find(item => item.type === 2)
    const imageCover = isExistedCover
      ? isExistedCover
      : productItem && productItem.images.length > 0
        ? productItem.images[0]
        : null
    return (
      <View style={{
        borderTopColor: '#DDD',
        borderTopWidth: 1,
        zIndex: 1,
        position: 'absolute',
        top: 100,
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
        bottom: 0,
        left: 0,
        right: 0
      }}>
        <View
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 30,
            height: 30,
            zIndex: 2,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              onToggleAddToCart()
            }}
          >
            <Ion name={'ios-close-outline'} style={{ fontSize: 40, color: 'red' }} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginBottom: 60 }}>
          <View style={{ display: 'flex', padding: 10, flexDirection: 'row' }}>
            <View style={{ width: 100, height: 100, backgroundColor: '#DDD' }}>
              <Image
                source={imageCover
                  ? { uri: imageCover.fullUrl }
                  : require('../../../assets/placeholder.png')}
                style={{ width: '100%', height: '100%' }} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 18 }}>{productItem.name}</Text>
            </View>
          </View>
          <View style={{ display: 'flex', padding: 10 }}>
            <Text style={{ fontSize: 16 }}>Choose product price</Text>
            {productItem.productPrices && getActivePrices(productItem.productPrices).map((price, index) => selectPriceOption({ index, priceSelected, price, onSelectProductPrice, currencyUnits }))}
          </View>
          <View style={{ display: 'flex', padding: 10 }}>
            <Text style={{ fontSize: 16 }}>Choose product variation</Text>
            {productItem.productVariations && productItem.productVariations.map((variant, index) => selectProductVariants({ index, variantSelected, variant, onSelectProductVariant }))}
          </View>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 16 }}>Quantity (max {variantSelected.quantity})</Text>
            <NumberInput
              onChangeText={(value) => {
                const quantity = parseInt(value, 10)
                if (!quantity) {
                  onChangeProductAdded(1)
                }
                else {
                  onChangeProductAdded(quantity)
                }
              }}
              onPlus={() => onChangeProductAdded(parseInt(totalProductAdded, 10) + 1)}
              onMinus={() => onChangeProductAdded(parseInt(totalProductAdded, 10) - 1)}
              value={`${totalProductAdded}`}
              containerStyle={{
                width: 150,
                paddingVertical: 5
              }}
            />
          </View>
        </ScrollView>
        <View style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 999,
          margin: 10,
          height: 50,
          backgroundColor: 'blue'
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => this.addToCart(productItem, totalProductAdded, variantSelected, priceSelected)}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default withNavigation(AddToCartPopup)
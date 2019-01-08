import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import moment from 'moment'
import { TextInputMask } from 'react-native-masked-text'
import { isFlashSaleProduct, formatCurrency, getActivePrices, showProductPrice } from '../../../common/utils/productUtils'

const flashSalePrice = ({ newPrice, oldPrice, currencyUnits }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
        <View style={{
          backgroundColor: 'red',
          height: 50,
          width: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{`-${newPrice.offPercent || 0}%`}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            <Text style={{ color: '#6F4E37', textAlign: 'center', fontSize: 18 }}>
              {showProductPrice(newPrice, currencyUnits)}
            </Text>
          </View>
          <Text style={{ marginBottom: 0, textAlign: 'center', paddingTop: 5, paddingBottom: 5, textDecorationLine: 'line-through' }}>
            {formatCurrency(oldPrice, currencyUnits)}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, width: '100%', height: 22, borderRadius: 5, backgroundColor: '#6F4E37', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginBottom: 0, color: 'white', fontSize: 14 }}>
          {`By ${moment(newPrice.toDate).format('LLL')}`}
        </Text>
      </View>
    </View>
  )
}

const normalPrice = (productPrices, currencyUnits) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      {getActivePrices(productPrices).map((price, index) =>
        <View style={(index < productPrices.length - 1) && { borderBottomWidth: 1, borderBottomColor: '#D4D4D4', width: '100%' }}>
          <Text key={index} style={{ color: '#6F4E37', textAlign: 'center', width: '100%', fontSize: 20, fontWeight: 'bold' }}>
            {showProductPrice(price, currencyUnits)}
          </Text>
        </View>)
      }
    </View>
  )
}

export default class ProductPrice extends Component {

  componentDidMount() {
    const { productItem, user, updateClick } = this.props
    user && updateClick(user, productItem.id)
  }

  render () {
    const {
      productItem,
      currencyUnits
    } = this.props
    // const { isFlashSale, newPrice, oldPrice } = isFlashSaleProduct(productItem.productPrices)

    // if (!productItem || productItem.productPrices.length === 0) {
    //   return <View />
    // }

    return (
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: 7,
          paddingTop: 7,
          paddingBottom: 7,
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* <Text style={{ color: '#6F4E37', textAlign: 'center', width: '100%', 
        fontSize: 20, fontWeight: 'bold' }}>{productItem.productPrice}đ</Text> */}
        <TextInputMask
          ref={ref => (this.inputRef = ref)}
          numberOfLines = {1}
          type={'money'}
          options={{
            suffixUnit: 'đ',
            unit: '',
            separator: ' ',
            precision: 0
          }}
          style={{ 
            textAlign: 'center' ,fontSize: 20, color: '#6F4E37', fontWeight: 'bold', 
            marginBottom: 0, padding: 0
          }}
          editable={false}
          value={productItem.productPrice}
        />
      </View>
    )
  }
}

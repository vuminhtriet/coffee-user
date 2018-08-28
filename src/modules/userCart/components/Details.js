import React, { PureComponent } from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Card,
  FormLabel,
  Avatar,
  Divider
} from 'react-native-elements'
import { getTotalAmount } from '../utils'
import NumberInput from '../../../common/components/elements/NumberInput'
import { CURRENCY_UNIT } from '../models'
import { formatCurrency } from '../../../common/utils/productUtils'

export default class Details extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderItem = (item, index) => {
    const fullUrl = getListImgUrl(item.item.images)

    return (
      <View
        key={index}
        style={{
          width: undefined,
          height: undefined,
          flexDirection: 'row',
          margin: 15
        }}
      >
        {fullUrl
          ? <Avatar
            large
            source={image}
          /> : <Avatar
            large
            source={require('../../../assets/placeholder.png')}
          />
        }
        <Avatar
          large
          source={image}
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
            fontSize: 20,
            color: '#E44C4C'
          }}>
            {item.unitAmount}
          </Text>
          <Text>
            Options: {`${item.productVariation ? item.productVariation.name : ''}`}
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
            {` ${item.quantity}`}
          </Text>
        </View>
      </View>
    )
  }

  renderEditableItem = (detail, index) => {
    const { changeProductQuantity, currencyUnits } = this.props
    const price = detail.item.productPrices.find(item => item.id === detail.productPriceId)
    const variant = detail.item.productVariations.find(item => item.id === detail.productVariationId)

    return (
      <View
        key={index}
        style={{
          width: undefined,
          height: undefined,
          flexDirection: 'row',
          margin: 15
        }}
      >
        <Avatar
          large
          source={require('../../../assets/placeholder.png')}
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
            {detail.item.name}
          </Text>
          <Text style={{
            fontSize: 18,
            color: '#E44C4C'
          }}>
            {formatCurrency(price, currencyUnits)}
          </Text>
          <NumberInput
            containerStyle={{ borderWidth: 2, borderWidthColor: 'red' }}
            onChangeText={(value) => {}}
            onPlus={() => changeProductQuantity(detail, index, parseInt(detail.quantity) + 1)}
            onMinus={() => changeProductQuantity(detail, index, parseInt(detail.quantity) - 1)}
            value={`${detail.quantity}`}
            containerStyle={{
              width: 150,
              paddingVertical: 5
            }}
          />
          <Text style={{
            height: 20
          }}>
            Options: {variant ? `${variant.name}` : 'This variation is unavailable'}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const {
      details,
      amounts,
      totalQuantity,
      editable = false,
      currencyUnits,
      onChangeProductQuantity
    } = this.props

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
          Cart details
        </FormLabel>
        {details && details.map((detail, index) => {
          return true
            ? this.renderEditableItem(detail, index)
            : this.renderItem(detail, index)
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
              fontWeight: 'bold'
            }}
          >
            Subtotal ({`${totalQuantity}`} items)
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            {`${getTotalAmount(amounts, currencyUnits)}`}
          </Text>
        </View>
      </Card>
    )
  }
}

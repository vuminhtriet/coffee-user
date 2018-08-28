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
import NumberInput from '../../../common/components/elements/NumberInput'

export default class Details extends PureComponent {
  constructor (props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.renderEditableItem = this.renderEditableItem.bind(this)
  }
  renderItem (detail, index) {
    return (
      <View
        key={detail.id}
        style={{
          width: undefined,
          height: undefined,
          flexDirection: 'row',
          margin: 15
        }}
      >
        <Avatar
          large
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
            {detail.title}
          </Text>
          <Text style={{
            fontSize: 20,
            color: '#E44C4C'
          }}>
            {detail.price}
          </Text>
          {detail.priceSale && <Text style={{
            textDecorationLine: 'line-through'
          }}>
            {detail.priceSale}
          </Text>}
          <Text style={{
          }}>
            Options: {`${detail.options.map((option) => option.title).join(', ')}`}
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
          <Text
            style={{
              fontWeight: 'bold'
            }}
          >
            x{` ${detail.quantity}`}
          </Text>
        </View>
      </View>
    )
  }
  renderEditableItem (detail, index) {
    const { onProductChange } = this.props
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
          source={detail.imageCover
            ? { uri: detail.imageCover }
            : undefined
          }
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
            {detail.title}
          </Text>
          {detail.priceSale && <Text style={{
            color: '#9C9C9C',
            textDecorationLine: 'line-through'
          }}>
            {detail.priceSale}
          </Text>}
          <Text style={{
            fontSize: 20,
            color: '#E44C4C'
          }}>
            {detail.price}
          </Text>
          <NumberInput
            onChangeText={(value) => onProductChange(detail, index, value)}
            onPlus={() => onProductChange(detail, index, parseInt(detail.quantity) + 1)}
            onMinus={() => onProductChange(detail, index, parseInt(detail.quantity) - 1)}
            value={`${detail.quantity}`}
            containerStyle={{
              width: 150,
              paddingVertical: 5
            }}
          />
          <Text style={{
            height: 20
          }}>
            Options: {`${detail.options.map((option) => option.title).join(', ')}` }
          </Text>
        </View>
      </View>
    )
  }
  render () {
    const { editable = false, total, quantity, details = [] } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0 }}>
          Order details
        </FormLabel>
        {details && details.map((detail, index) => {
          return editable
            ? this.renderEditableItem(detail, index)
            : this.renderItem(detail, index)
        })}
        <Divider
          style={{
            backgroundColor: '#9C9C9C',
            height: 1,
            width: '120%',
            marginLeft: -20 }} />
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
            Subtotal ({`${quantity}`} items)
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            {`${total}`}
          </Text>
        </View>
      </Card>
    )
  }
}

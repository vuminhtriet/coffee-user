import React, { Component } from 'react'
import {
  View,
  TextInput,
  Text,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import NumberInput from '../../../common/components/elements/NumberInput'

export default class ProductAddToCart extends Component {
  render () {
    const { onChangeProductAdded, totalProductAdded } = this.props

    return (
      <NumberInput
        onChangeText={(value) => {}}
        onPlus={() => onChangeProductAdded(parseInt(totalProductAdded, 10) + 1)}
        onMinus={() => onChangeProductAdded(parseInt(totalProductAdded, 10) - 1)}
        value={`${totalProductAdded}`}
        containerStyle={{
          width: 150,
          paddingVertical: 5
        }}
      />
    )
  }
}

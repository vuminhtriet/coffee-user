import React, { Component } from 'react'
import {
    TextInput,
    View,
    Text,
    TouchableOpacity
} from 'react-native'

export default class NumberInput extends Component {
  render () {
    const { onPlus, onMinus, containerStyle, inputStyle, ...rest } = this.props
    return (
      <View
        style={[{
          flexDirection: 'row',
          width: undefined,
          height: undefined
        }, containerStyle]}
      >
        <View style={{ width: 40 }}>
          <TouchableOpacity
            onPress={onMinus}
            style={{
              backgroundColor: '#1A86E0',
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18 }}>-</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: '#9C9C9C',
            borderWidth: 1,
            margin: 0,
            textAlign: 'center',
            ...inputStyle
          }}
          underlineColorAndroid='transparent'
          {...rest}
        />
        <View style={{ width: 40 }}>
          <TouchableOpacity
            onPress={onPlus}
            style={{
              backgroundColor: '#1A86E0',
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

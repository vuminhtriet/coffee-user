import React from 'react'
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

export default ({ disabled, onPress, inStyle, textStyle, title }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={[
      styles.button,
      inStyle
    ]}
  >
    <Text style={[styles.txtButton, textStyle]}>{title || ''}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 26,
    borderRadius: 3,
    borderColor: '#6F4E37',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  txtButton: { color: 'red', textAlign: 'center' }
})

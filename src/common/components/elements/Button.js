import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export default ({ isGhosh, isDash, disabled, onPress, inStyle, textStyle, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, inStyle]}
    disabled={disabled}
    >
    <LinearGradient
      colors={
          isGhosh
          ? ['rgba(109,127,181,0.3)', 'rgba(109,127,181,0.3)']
          : (isDash
            ? ['transparent', 'transparent']
            : (disabled
              ? ['#a8a8a8', '#686868']
              : ['#00A5FF', '#006AEA'])
            )
          }
      style={styles.linearGradient}
      >
      <Text style={[styles.txtButton, textStyle]}>
        {title.toUpperCase()}
      </Text>
    </LinearGradient >
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 55
  },
  linearGradient: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  },
  txtButton: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 15,
    color: '#ffffff',
    backgroundColor: 'transparent'
  }
})

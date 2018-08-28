import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

export default class ErrorMessage extends Component {
  render () {
    const { msgError } = this.props
    return (
      <View style={styles.messageError}>
        <Text style={styles.txtError}>{msgError}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  messageError: {
    alignItems: 'flex-end',
    paddingBottom: 10
  },
  txtError: {
    color: '#FF3B3B',
    letterSpacing: 1.2,
    fontSize: 12,
    textAlign: 'right'
  }
})

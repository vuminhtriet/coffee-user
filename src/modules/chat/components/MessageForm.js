import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'

import styles from '../styles/messageFormStyles'

const OPACITY_ENABLED = 1.0
const OPACITY_DISABLED = 0.2

export default class MessageForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }

    this.handleMessageChange = (message) => {
      this.setState({message: message})
    }

    this.handleButtonPress = () => {
      this.props.sendMessage(this.state.message)
      this.setState({message: ''})
    }
  }

  componentDidUpdate (prevProps) {
  }

  render () {
    const sending = this.props.sending
    // const isButtonDisabled = sending || this.props.message.trim().length == 0
    const isButtonDisabled = false
    const opacity = isButtonDisabled ? OPACITY_DISABLED : OPACITY_ENABLED

    return (
      <View style={styles.container}>

        <TextInput
          style={styles.textInput}
          returnKeyType='send'
          onChangeText={this.handleMessageChange}
          value={this.state.message}
          underlineColorAndroid={'transparent'}
          editable={!sending}
          placeholder='Send message' />

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleButtonPress}
          disabled={isButtonDisabled}>

          <Image
            source={require('../../../assets/images/ic_send.png')}
            style={{ opacity: opacity }} />

        </TouchableOpacity>

      </View>
    )
  }
}

import React, { Component } from 'react'
import {
  View,
  Text,
  Modal,
  Keyboard,
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native'
import { Button, Divider, FormInput, FormValidationMessage } from 'react-native-elements'
import SignUpDetailForm from '../containers/SignUpDetailForm'
import { validateEmail } from '../../../common/utils/validate'

export default class SignUpForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      phone: false,
      signup: false,
      value: '',
      error: undefined,
      code: '',
      password: '',
      keyboard: false
    }
    this.onResent = this.onResent.bind(this)
    this.requestSignup = this.requestSignup.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.onBackSignup = this.onBackSignup.bind(this)

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.onKeyboardWillShow.bind(this))
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.onKeyboardWillHide.bind(this))
  }

  onKeyboardWillShow (frames) {
    this.setState({
      keyboard: true
    })
  }

  onKeyboardWillHide (frames) {
    this.setState({
      keyboard: false
    })
  }

  componentWillUnmount () {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  onBackSignup () {
    const { signup } = this.state
    this.setState({
      signup: !signup
    })
  }

  onResent () {
    this.requestSignup()
  }

  async requestSignup () {
    // TODO: Request api here
    const { value } = this.state
    const { requestSignup } = this.props
    if (!value || !`${value}`.trim()) {
      return this.setState({
        error: 'Required field.'
      })
    }
    if (!validateEmail(value)) {
      return this.setState({
        error: 'Invalid email format.'
      })
    }
    try {
      const result = await requestSignup(value)
      if (result.success) {
        return this.setState({
          signup: true,
          password: result.password
        })
      } else if (result.message) {
        return this.setState({
          error: result.message
        })
      }
      throw new Error('CAN_NOT_SIGNUP_NOW')
    } catch (eror) {
      this.setState({
        error: "Can't signup now."
      })
    }
  }

  changeMode () {
    const { phone } = this.state
    this.setState({
      phone: !phone
    })
  }

  render () {
    const { keyboard, phone, signup, value, error, code, password } = this.state
    const { navigation } = this.props
    return (
      <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: '#E9E9EF' }}>
        <View style={{ width: '100%', flex: 1 }}>
          <FormInput
            autoCapitalize='none'
            onChangeText={(value) => this.setState({ value, error: undefined })}
            containerStyle={{ marginTop: 50 }}
            inputStyle={{ fontSize: 22 }}
            placeholder={phone
              ? 'Enter phone number' : 'Enter your email address'}
          />
          {error && <FormValidationMessage> { error } </FormValidationMessage>}
          <Button
            onPress={this.requestSignup}
            title='Continue'
            containerViewStyle={{ marginTop: 25 }}
          />
        </View>
        {!keyboard && <View style={{ width: '100%', height: 200, flexDirection: 'column' }}>
          <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Divider style={{ backgroundColor: '#9C9C9C', height: 2, width: '90%' }} />
            <Text
              style={{
                height: 50,
                position: 'absolute',
                padding: 15,
                backgroundColor: '#E9E9EF'
              }}>
              Or sign up with
            </Text>
          </View>
          <View style={{ width: '100%', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              onPress={this.changeMode}
              backgroundColor='#972525'
              icon={{name: 'email', type: 'zocial', buttonStyle: { marginLeft: 0 }}}
              title={phone ? 'Sign up by email' : 'Sign up by SMS'}
              containerViewStyle={{ width: '90%', marginVertical: 10 }}
            />
            <Button
              backgroundColor='#2C6997'
              icon={{name: 'logo-facebook', type: 'ionicon', buttonStyle: { marginLeft: 0 }}}
              title='Continue with Facebook'
              containerViewStyle={{ width: '90%', marginBottom: 10 }}
            />
          </View>
        </View>}
        <Modal
          animationType='none'
          transparent={false}
          visible={signup}
        >
          <SignUpDetailForm
            password={password}
            phone={phone}
            value={value}
            code={code}
            onResent={this.onResent}
            onBack={this.onBackSignup}
            navigation={navigation}
          />
        </Modal>
      </View>
    )
  }
}

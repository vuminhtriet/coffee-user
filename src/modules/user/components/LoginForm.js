import React, { Component } from 'react'
import {
  Platform,
  View,
  Text,
  ScrollView,
  Keyboard,
  UIManager,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native'
import { Button, Divider, FormInput, FormValidationMessage } from 'react-native-elements'
import styles from '../styles/styles'
import Modal from '../../../common/components/elements/Modal'
import ResetPasswordForm from '../containers/ResetPasswordForm'

export default class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errors: {},
      error: undefined,
      keyboard: false,
      resetPassword: false
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.login = this.login.bind(this)
    this.forgetPassword = this.forgetPassword.bind(this)
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.onKeyboardWillShow.bind(this))
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.onKeyboardWillHide.bind(this))
  }

  componentDidMount(){
    // const { email, pass } = this.props
    // const { username, password, errors } = this.state
    // if (username.length == 0 && password.length == 0){
    //   this.setState({
    //   username: email,  
    //   password: pass
    // })}
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

  async login () {
    const { username, password } = this.state
    const { login } = this.props
    const errors = {}
    if (!username || !username.trim()) {
    // if (username.length == 0 || username.trim().length == 0) {
      errors.username = 'Thiếu địa chỉ email.'
    }
    if (!password || !password.trim()) {
    // if (password.length == 0 || password.trim().length == 0) {
      errors.password = 'Thiếu mật khẩu.'
    }
    if (Object.keys(errors).length) {
      return this.setState({
        errors
      })
    }
    const result = await login(username, password)
    if (!result) {
      this.setState({
        error: 'Email hoặc mật khẩu không chính xác.'
      })
    }
  }

  async forgetPassword () {
    // const { username } = this.state
    // const { forgetPassword } = this.props
    // const errors = {}
    // if (!username || !username.trim()) {
    //   errors.username = '* Email required for reset password.'
    // }
    // if (Object.keys(errors).length) {
    //   return this.setState({
    //     errors
    //   })
    // }
    // const result = await forgetPassword(username)
    // if (!result) {
    //   this.setState({
    //     error: '* Email not found.'
    //   })
    // } else {
    //   this.setState({
    //     resetPassword: true
    //   })
    // }
  }

  render () {
    const { username, resetPassword, error, keyboard, errors } = this.state
    const {email, pass} = this.props
    return (
      <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: '#E9E9EF' }}>
        <View style={{ width: '100%', flex: 1 }}>
          <ScrollView>
            <FormInput
              onChangeText={(username) => this.setState({
                username,
                errors: {
                  ...errors,
                  username: undefined
                }
              })}
              autoCapitalize='none'
              // defaultValue={email}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ fontSize: 22 }}
              underlineColorAndroid='#D7D9E2'
              placeholder={'Nhập địa chỉ email'} />
            {errors.username && <FormValidationMessage>
              {errors.username}
            </FormValidationMessage>}

            <FormInput
              onChangeText={(password) => this.setState({
                password,
                errors: {
                  ...errors,
                  password: undefined
                }
              })}
              autoCapitalize='none'
              secureTextEntry
              // defaultValue={pass}
              containerStyle={{ marginTop: 20 }}
              inputStyle={{ fontSize: 22 }}
              underlineColorAndroid='#D7D9E2'
              placeholder={'Nhập mật khẩu'} />
            {errors.password && <FormValidationMessage>
              {errors.password}
            </FormValidationMessage>}

            {/* <TouchableOpacity
              onPress={this.forgetPassword}
            >
              <Text
                style={{
                  color: '#3AA5F5',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  paddingRight: 15,
                  paddingVertical: 20
                }}>
                Quên mật khẩu ?
              </Text>
            </TouchableOpacity> */}
            {error && <FormValidationMessage>
              {error}
            </FormValidationMessage>}

            <Button
              onPress={this.login}
              backgroundColor='#E44C4B'
              title='ĐĂNG NHẬP'
              containerViewStyle={{ marginTop: 0 }}
            />
          </ScrollView>
        </View>
        {/* {!keyboard && <View style={{ width: '100%', height: 175, flexDirection: 'column' }}>
          <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Divider style={{ backgroundColor: '#9C9C9C', height: 2, width: '90%' }} />
            <Text
              style={{
                height: 50,
                position: 'absolute',
                padding: 15,
                backgroundColor: '#E9E9EF'
              }}
            >
              Or sign in with
            </Text>
          </View>
          <View style={{ width: '100%', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              backgroundColor='#972525'
              icon={{name: 'mobile-phone', type: 'font-awesome', buttonStyle: { marginLeft: 0 }}}
              title='Sign in with SMS'
              containerViewStyle={{ width: '90%', marginVertical: 10 }}
            />
            <Button
              backgroundColor='#2C6997'
              icon={{name: 'logo-facebook', type: 'ionicon', buttonStyle: { marginLeft: 0 }}}
              title='Continue with Facebook'
              containerViewStyle={{ width: '90%', marginBottom: 10 }}
            />
          </View>
        </View>} */}
        <Modal
          animationType='none'
          transparent={false}
          visible={resetPassword}
        >
          <ResetPasswordForm
            value={username}
            onBack={() => this.setState({ resetPassword: false })}
            onResent={this.onResent}
          />
        </Modal>
      </View>
    )
  }
}

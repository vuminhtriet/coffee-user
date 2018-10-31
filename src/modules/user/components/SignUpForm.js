import React, { Component } from 'react'
import {
  View,
  Text,
  Modal,
  Alert,
  Keyboard,
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native'
import { Button, Divider, FormInput, FormValidationMessage } from 'react-native-elements'
import SignUpDetailForm from '../containers/SignUpDetailForm'
import axios from 'axios'
import { TEST_URL } from '../../../common/models'
import { validateEmail,validateMinLength } from '../../../common/utils/validate'

export default class SignUpForm extends Component {
  constructor (props) {
    super(props)
    const user = {
      password: '',
      confirmPassword: '',
      displayName: '',
      birthday: '',
      gender: '',
      phone: '',
      email: '',
      nationality: ''
    }
    this.state = {
      phone: false,
      signup: false,
      value: '',
      user,
      errors: {},
      error: undefined,
      code: '',
      password: '',
      keyboard: false
    }
    this.onResent = this.onResent.bind(this)
    this.requestSignup = this.requestSignup.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.onBackSignup = this.onBackSignup.bind(this)
    this.onChangeText = this.onChangeText.bind(this)

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
    const { value, user } = this.state
    const tempErrors = {}
    const { signup, setEmail, setPassword, handleIndexChange, login } = this.props
    if (!user.email || !`${user.email}`.trim()) {
      tempErrors.email = 'Thiếu địa chỉ email.'
    }else if (!validateEmail(user.email)) {
      tempErrors.email = 'Email không đúng.'
    }
    if (!user.password || !user.password.trim()) {
      tempErrors.password = 'Thiếu mật khẩu.'
    }
    if (!validateMinLength(user.password)) {
      tempErrors.password = 'Mật khẩu phải nhiều hơn hoặc bằng 6 ký tự.'
    }
    if (!user.confirmPassword || !user.confirmPassword.trim()) {
      tempErrors.confirmPassword = 'Thiếu mật khẩu xác nhận.'
    }
    if (user.password !== user.confirmPassword) {
      tempErrors.confirmPassword = 'Mật khẩu không khớp.'
    }
    if (Object.keys(tempErrors).length > 0) {
      return this.setState({
        errors: tempErrors
      })
    }
    try {
      const result = await signup(user.email, user.password)
      if (!result) {
        // return Alert.alert(
        //   'CANT SIGN UP',
        //   'Email already exists',
        //   [
        //     {text: 'OK', onPress: () => console.log('OK Pressed')}
        //   ],
        //   { cancelable: false }
        // )
        tempErrors.email = 'Địa chỉ email đã tồn tại.'
        return this.setState({
          errors: tempErrors
        })
      }
      else{
        return (
          login(user.email, user.password)
        )
      }
    } catch (error) {
      tempErrors.email = 'Địa chỉ email đã tồn tại.'
      return this.setState({
        errors: tempErrors
      })
    }
  }

  changeMode () {
    const { phone } = this.state
    this.setState({
      phone: !phone
    })
  }

  onChangeText (text, type) {
    const { user, errors } = this.state
    this.setState({
      user: {
        ...user,
        [type]: text
      },
      errors: {
        ...errors,
        [type]: undefined
      }
    })
  }

  render () {
    const { keyboard, phone, value, error, code, password, user, errors } = this.state
    const { navigation } = this.props
    return (
      <View style={{ width: '100%', height: '100%', flexDirection: 'column', backgroundColor: '#E9E9EF' }}>
        <View style={{ width: '100%', flex: 1 }}>
          <FormInput
            autoCapitalize='none'
            onChangeText={(text) => this.onChangeText(text, 'email')}
            containerStyle={{ marginTop: 20 }}
              inputStyle={{ fontSize: 22 }}
              underlineColorAndroid='#D7D9E2'
            placeholder={phone
              ? 'Nhập số điện thoại' : 'Nhập địa chỉ email'}
          />
          {errors.email && (<FormValidationMessage> { errors.email } </FormValidationMessage>)}
          <FormInput
            autoCapitalize='none'
            secureTextEntry
            value={user.password}
            onChangeText={(text) => this.onChangeText(text, 'password')}
            containerStyle={{ marginTop: 20 }}
              inputStyle={{ fontSize: 22 }}
              underlineColorAndroid='#D7D9E2'
            placeholder='Nhập mật khẩu'
          />
          {errors.password && (
            <FormValidationMessage>
              {errors.password}
            </FormValidationMessage>
          )}
          <FormInput
            autoCapitalize='none'
            secureTextEntry
            value={user.confirmPassword}
            placeholder='Nhập lại mật khẩu'
            onChangeText={(text) => this.onChangeText(text, 'confirmPassword')}
            containerStyle={{ marginTop: 20 }}
              inputStyle={{ fontSize: 22 }}
              underlineColorAndroid='#D7D9E2'
            containerStyle={{ marginVertical: 20 }}
          />
          {errors.confirmPassword && (
            <FormValidationMessage>
              {errors.confirmPassword}
            </FormValidationMessage>
          )}
          <Button
            onPress={this.requestSignup}
            title='Tiếp tục'
            containerViewStyle={{ marginTop: 25 }}
          />
        </View>
        {/* {!keyboard && <View style={{ width: '100%', height: 200, flexDirection: 'column' }}>
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
        </View>} */}
        {/* <Modal
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
        </Modal> */}
      </View>
    )
  }
}

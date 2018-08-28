import React, { Component } from 'react'
import {
  Text,
  View,
  Platform,
  TouchableOpacity
} from 'react-native'
import {
  Button,
  FormInput,
  FormLabel,
  FormValidationMessage
} from 'react-native-elements'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { validateMinLength } from '../../../common/utils/validate'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class ResetPasswordForm extends Component {
  constructor (props) {
    super(props)
    const { phone, value } = props
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
    user[phone ? 'phone' : 'email'] = value
    this.state = {
      step: 1,
      code: '',
      user,
      errors: {},
      errorCode: undefined
    }
    this.onChangeText = this.onChangeText.bind(this)
    this.onChangeCode = this.onChangeCode.bind(this)
    this.renderStep = this.renderStep.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onNext = this.onNext.bind(this)
  }

  onChangeCode (code) {
    this.setState({
      code,
      errorCode: undefined
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

  renderStep () {
    const { onResent } = this.props
    const { step, code, user, errors, errorCode } = this.state

    switch (step) {
      case 1:
        return (
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={{ marginVertical: 20, paddingHorizontal: 15 }}>
              We already sent the email with the temporary password to your email address
            </Text>
            <FormInput
              autoCapitalize='none'
              value={code}
              placeholder='Enter temporary password'
              onChangeText={this.onChangeCode}
            />
            {errorCode && <FormValidationMessage>{errorCode}</FormValidationMessage>}
            <Button
              containerViewStyle={{ marginVertical: 20 }}
              title='Continue'
              onPress={this.onNext}
              backgroundColor='#E44C4B' />
            <TouchableOpacity
              onPress={onResent}
              style={{ justifyContent: 'center', alignItems: 'center', height: undefined }}
            >
              <Text
                style={{ padding: 10, maxWidth: '95%', backgroundColor: '#EEEEEE', height: undefined }}
              >
                Resent if you did not receive our email
              </Text>
            </TouchableOpacity>
          </View>
        )
      case 2:
        return (
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={{ marginVertical: 20, paddingHorizontal: 15 }}>
              Please reset your password to protect your account
            </Text>
            <FormInput
              autoCapitalize='none'
              secureTextEntry
              value={user.password}
              onChangeText={(text) => this.onChangeText(text, 'password')}
              placeholder='Enter your new password'
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
              placeholder='Retype your new password'
              onChangeText={(text) => this.onChangeText(text, 'confirmPassword')}
              containerStyle={{ marginVertical: 20 }}
            />
            {errors.confirmPassword && (
              <FormValidationMessage>
                {errors.confirmPassword}
              </FormValidationMessage>
            )}
            <Button
              title='Continue'
              onPress={this.onNext}
              containerViewStyle={{ marginTop: 10 }}
              backgroundColor='#E44C4B' />
          </View>
        )
    }
  }

  async onNext () {
    const {
      value,
      signup,
      createPassword,
      verifyPassword,
      password
    } = this.props
    const { step, user } = this.state
    const errors = {}
    let result = null
    switch (step) {
      case 1:
        result = await verifyPassword(value, password)
        if (!result) {
          return this.setState({
            errorCode: 'Verify your password error.'
          })
        }
        this.tempToken = result
        break
      case 2:
        if (!user.password || !user.password.trim()) {
          errors.password = 'Password required.'
        }
        if (validateMinLength(errors.password)) {
          errors.password = 'Password must more than 6 character.'
        }
        if (!user.confirmPassword || !user.confirmPassword.trim()) {
          errors.confirmPassword = 'Confirm password required.'
        }
        if (user.password !== user.confirmPassword) {
          errors.confirmPassword = 'Confirm password do not correct.'
        }
        if (Object.keys(errors).length > 0) {
          return this.setState({
            errors
          })
        }
        try {
          result = await createPassword(user.password, this.tempToken)
          if (!result) {
            throw new Error('SERVER_ERROR')
          }
        } catch (error) {
          return this.setState({
            errorStep2: 'Unknow error from server.'
          })
        }
        break
    }
    this.setState({
      step: step + 1
    })
  }

  onBack () {
    const { step } = this.state
    const { onBack } = this.props

    if (step === 1) {
      return onBack()
    }
    this.setState({
      step: step - 1
    })
  }

  render () {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          ...Platform.select({
            ios: ifIphoneX({
              paddingTop: 32
            }, {
              paddingTop: 20
            }),
            android: {
              paddingTop: 0
            }
          })
        }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Info registration'
            onBack={this.onBack} />
        </View>
        <View
          style={{ flex: 1 }}
        >
          {this.renderStep()}
        </View>
      </View>)
  }
}

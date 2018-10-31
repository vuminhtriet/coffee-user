import moment from 'moment'
import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native'
import {
  Button,
  FormInput,
  FormLabel,
  FormValidationMessage
} from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import MultiSelect from '../../../libraries/components/MultipleSelect'
import { Dropdown } from 'react-native-material-dropdown'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { validateMinLength } from '../../../common/utils/validate'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class SignUpDetailForm extends Component {
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
      step: 2,
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
    const { onResent, countries } = this.props
    const { step, code, user, errors, errorCode } = this.state

    switch (step) {
      case 1:
        return (
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            {/* <Text style={{ marginVertical: 20, paddingHorizontal: 15 }}>
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
            </TouchableOpacity> */}
          </View>
        )
      case 2:
        return (
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            {/* <Text style={{ marginVertical: 20, paddingHorizontal: 15 }}>
              Please reset your password to protect your account
            </Text> */}
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
            {errors.signup && (
              <FormValidationMessage>
                {errors.signup}
              </FormValidationMessage>
            )}
            <Button
              title='Continue'
              onPress={this.onNext}
              containerViewStyle={{ marginTop: 10 }}
              backgroundColor='#E44C4B' />
          </View>
        )
      case 3:
        const country = countries.find(item => `${item.id}` === `${user.nationality}`)
        return (
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <ScrollView>
              <FormLabel>
                Display name
              </FormLabel>
              <FormInput
                value={user.displayName}
                onChangeText={(text) => this.onChangeText(text, 'displayName')}
                placeholder='Enter your display name'
              />
              {errors.displayName && (
                <FormValidationMessage>
                  {errors.displayName}
                </FormValidationMessage>
              )}
              <FormLabel>
                Birthday
              </FormLabel>
              <DatePicker
                style={{
                  marginHorizontal: 20,
                  marginVertical: 20,
                  width: undefined
                }}
                date={user.birthday}
                mode='date'
                placeholder='Select date'
                format='YYYY-MM-DD'
                maxDate={moment().format('YYYY-MM-DD')}
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                    position: 'absolute'
                  },
                  dateInput: {
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderColor: '#9C9C9C',
                    width: '100%'
                  },
                  placeholderText: {
                    textAlign: 'left',
                    width: '100%'
                  }
                }}
                onDateChange={(text) => this.onChangeText(text, 'birthday')}
              />
              {errors.birthday && (
                <FormValidationMessage>
                  {errors.birthday}
                </FormValidationMessage>
              )}
              <FormLabel>
                Gender
              </FormLabel>
              <Dropdown
                data={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
                onChangeText={(text) => this.onChangeText(text, 'gender')}
                containerStyle={{ marginHorizontal: 20 }}
              />
              {errors.gender && (
                <FormValidationMessage>
                  {errors.gender}
                </FormValidationMessage>
              )}
              <FormLabel>
                Nationality
              </FormLabel>
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 20
                }}
              >
                <MultiSelect
                  hideTags
                  single
                  items={countries || []}
                  uniqueKey='id'
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={(text) => {
                    this.onChangeText(text[0], 'nationality')
                  }}
                  selectedItems={[user.nationality]}
                  selectText={!country ? 'Choose your country' : country.name}
                  searchInputPlaceholderText='Search country...'
                  tagRemoveIconColor='transparent'
                  tagBorderColor='#CCC'
                  tagTextColor='#CCC'
                  selectedItemTextColor='#CCC'
                  selectedItemIconColor='#CCC'
                  itemTextColor='#000'
                  displayKey='name'
                  submitButtonColor='#CCC'
                  submitButtonText='Submit'
                  fixedHeight
                  hideSubmitButton
                  searchInputStyle={{
                    color: '#CCC',
                    height: 30
                  }}
                />
              </View>
              {/* <Dropdown
                data={countries.map(item => {
                  return {
                    value: item.id,
                    label: item.name
                  }
                })}
                containerStyle={{
                  marginHorizontal: 20,
                  marginVertical: 10
                }}
                onChangeText={(text) => this.onChangeText(text, 'nationality')}
              /> */}
              {errors.nationality && (
                <FormValidationMessage>
                  {errors.nationality}
                </FormValidationMessage>
              )}
              <Button
                title='Finish'
                onPress={this.onNext}
                containerViewStyle={{ marginTop: 10 }}
                backgroundColor='#E44C4B' />
            </ScrollView>
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
    const { step, user, code } = this.state
    const errors = {}
    let result = null
    switch (step) {
      case 1:
        // TODO: Check code here
        if (`${code}`.trim() !== `${password}`.trim()) {
          return this.setState({
            errorCode: 'Please check your email to get your valid password.'
          })
        }
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
          result = await signup(value, password)
          // if (result.success) {
          // return this.setState({
          //   signup: true
          //   // password: result.password
          // })
          // } else if (result.message) {
          //   return this.setState({
          //     error: result.message
          //   })
          // }
          errors.signup = "sfasf"
          return this.setState({
              errors
            })
        } catch (error) {
          this.setState({
            error: "Can't signup now."
          })
        }
        // try {
        //   // Test
        //   this.tempToken = await verifyPassword(value, password)
        //   result = await createPassword(user.password, this.tempToken)
        //   if (!result) {
        //     throw new Error('SERVER_ERROR')
        //   }
        // } catch (error) {
        //   return this.setState({
        //     errorStep2: 'Unknow error from server.'
        //   })
        // }
        break
      case 3:
        if (!user.displayName || !user.displayName.trim()) {
          errors.displayName = 'Name required.'
        }
        if (!user.birthday || !user.birthday.trim()) {
          errors.birthday = 'Birthday required.'
        }
        if (!user.gender || !user.gender.trim()) {
          errors.gender = 'Gender required.'
        }
        // if (!user.nation || !user.nation.trim()) {
        //   errors.nation = 'Nation required.'
        // }
        if (Object.keys(errors).length > 0) {
          return this.setState({
            errors
          })
        }
        if (!this.tempToken) {
          return this.onBack()
        }
        return signup(user, this.tempToken)
    }
    this.setState({
      step: step + 1
    })
  }

  onBack () {
    const { navigation } = this.props
    const { step } = this.state
    const { onBack } = this.props
    if (step === 2) {
      navigation.goBack()
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

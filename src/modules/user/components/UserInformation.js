import moment from 'moment'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'
import QRCode from 'react-native-qrcode'
import DatePicker from 'react-native-datepicker'
import MultiSelect from '../../../libraries/components/MultipleSelect'
import { Dropdown } from 'react-native-material-dropdown'
import {
  Icon,
  Card,
  FormLabel,
  FormInput,
  Button,
  FormValidationMessage
} from 'react-native-elements'
import { isEmpty } from 'lodash'

export default class UserInformation extends Component {
  constructor (props) {
    super(props)
    const { user } = props
    const addresses = user.addresses && user.addresses.find(item => item.isDefault)
    this.state = {
      displayName: user.displayName || '',
      birthdate: moment(user.birthdate).format('YYYY-MM-DD') || '',
      gender: user.gender || 'male',
      nationality: (addresses && `${addresses.countryId}`) || '',
      addressId: (addresses && `${addresses.id}`) || undefined,
      address: (addresses && `${addresses.fullAddress}`) || '',
      errors: {},
      qrcode: null
    }
    this.submit = this.submit.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.deleteUserPayment = this.deleteUserPayment.bind(this)
  }

  async deleteUserPayment (payment) {
    const {
      token,
      user,
      getUserInformation,
      deleteUserPaymentMethod
    } = this.props
    await deleteUserPaymentMethod(token, user, payment)
    getUserInformation(token, user.id)
  }

  submit () {
    const { token, update, user } = this.props
    const { displayName, birthdate, gender, nationality, addressId, address } = this.state
    const errors = {}
    if (!displayName) {
      errors.displayName = '* Display name required'
    }
    if (!address) {
      errors.address = '* Address required'
    }
    if (!isEmpty(errors)) {
      this.setState({ errors })
    } else {
      try {
        update(token, {
          id: user.id,
          displayName,
          birthdate,
          gender,
          nationality,
          address
        }, addressId)
      } catch (error) {

      }
    }
  }

  componentWillReceiveProps (nextProp) {
    const { user } = this.props
    if (nextProp.user && JSON.stringify(user) !== JSON.stringify(nextProp.user)) {
      const addresses = nextProp.user.addresses &&
        nextProp.user.addresses.find(item => item.isDefault)
      this.setState({
        displayName: nextProp.user.displayName || '',
        birthdate: moment(nextProp.user.birthdate).format('YYYY-MM-DD') || '',
        gender: nextProp.user.gender || 'male',
        nationality: (addresses && `${addresses.countryId}`) || '',
        addressId: (addresses && `${addresses.id}`) || undefined,
        address: (addresses && `${addresses.fullAddress}`) || '',
        errors: {}
      })
    }
  }

  onChangeText (text, field) {
    const { errors } = this.state
    this.setState({
      [field]: text,
      errors: {
        ...errors,
        [field]: undefined
      }
    })
  }

  renderPaymentInfo (payment, paymentType) {
    if (!paymentType || !payment) {
      return null
    }
    switch (paymentType.renderType) {
      case 2:
        return [
          <View
            style={{ flexDirection: 'row', width: '100%' }}
            key='view'
          >
            <FormLabel containerStyle={{ flex: 1 }} key='lable'>
              {payment.paymentAddress}
            </FormLabel>
            <Icon
              name='qrcode-scan'
              size={34}
              type='material-community'
              onPress={() => this.setState({ qrcode: payment.paymentAddress })}
              containerStyle={{ width: 45, marginRight: 15, marginTop: 10 }}
            />
          </View>
        ]
      case 1:
        return [
          <FormLabel key='lable1'>
            Account name: {payment.accountName}
          </FormLabel>,
          <FormLabel key='lable2'>
            Bank name: {payment.bankName}
          </FormLabel>,
          <FormLabel key='lable3'>
            Branch name: {payment.branchName}
          </FormLabel>,
          <FormLabel key='label4'>
            Account number: {payment.accountNumber}
          </FormLabel>
        ]
      default:
        return null
    }
  }

  render () {
    const { qrcode, nationality, errors, displayName, birthdate, gender, address } = this.state
    const { navigation, countries } = this.props
    const country = countries.find(item => `${item.id}` === `${nationality}`)
    return (
      <KeyboardAvoidingView
        style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
        <ScrollView>
          <Card
            containerStyle={{
              margin: 0,
              width: undefined,
              height: undefined
            }}>
            <FormLabel>
              Display name
            </FormLabel>
            <FormInput
              placeholder='Enter your address'
              value={displayName || ''}
              onChangeText={(text) => this.onChangeText(text, 'displayName')}
            />
            {errors.displayName &&
              (<FormValidationMessage>{errors.displayName}</FormValidationMessage>)}
            <FormLabel>
              Birthday
            </FormLabel>
            <DatePicker
              style={{
                marginHorizontal: 20,
                width: undefined
              }}
              date={birthdate}
              mode='date'
              placeholder='Select date'
              format='YYYY-MM-DD'
              maxDate={moment().format('YYYY-MM-DD')}
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              onChangeText={(text) => this.onChangeText(text, 'gender')}
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
              onDateChange={(text) => this.onChangeText(text, 'birthdate')}
            />
            <FormLabel>
              Gender
            </FormLabel>
            <Dropdown
              value={gender}
              data={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
              ]}
              onChangeText={(text) => this.onChangeText(text, 'gender')}
              containerStyle={{ marginHorizontal: 20 }}
            />
            <FormLabel>
              Nationality
            </FormLabel>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20
              }}
            >
              <MultiSelect
                hideTags
                single
                items={countries}
                uniqueKey='id'
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={(text) => this.onChangeText(text[0], 'nationality')}
                selectedItems={countries}
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
              value={`${nationality}`}
              data={countries.map(item => {
                return {
                  value: `${item.id}`,
                  label: item.name
                }
              })}
              onChangeText={(text) => this.onChangeText(text, 'nationality')}
              containerStyle={{ marginHorizontal: 20 }}
            /> */}
            <FormLabel>
              Address
            </FormLabel>
            <FormInput
              multiline
              placeholder='Enter your address'
              value={address || ''}
              onChangeText={(text) => this.onChangeText(text, 'address')}
            />
            {errors.address &&
              (<FormValidationMessage>{errors.address}</FormValidationMessage>)}
          </Card>
          <View
            style={{
              margin: 0,
              width: undefined,
              height: undefined
            }}>
            <View
              style={{
                width: undefined,
                height: 60,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <View style={{ flex: 1 }}>
                <Button title='Cancel' onPress={() => navigation.goBack()} />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title='Update'
                  onPress={this.submit}
                  backgroundColor='#E44C4C'
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <Modal
          onModalHide={() => this.setState({ qrcode: null })}
          visible={qrcode !== null}
          transparent
          onBackdropPress={() => this.setState({ qrcode: null })}
        >
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.setState({ qrcode: null })}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
                backgroundColor:
                  '#000',
                opacity: 0.2
              }}
            />
            <View
              style={{
                width: 300,
                height: 300,
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF'
              }}>
              <QRCode
                value={qrcode || ''}
                size={250}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    )
  }
}

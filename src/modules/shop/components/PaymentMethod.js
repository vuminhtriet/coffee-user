import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Alert,
  Platform
} from 'react-native'
import Permissions from 'react-native-permissions'
import { FormLabel, FormInput, Icon, Button, FormValidationMessage } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import QRScan from '../../../common/components/pages/QRScan'
import { PAYMENT_TYPE } from '../../../common/models'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class PaymentMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: null,
      values: {},
      error: undefined
    }

    this.changeText = this.changeText.bind(this)
    this.addPayment = this.addPayment.bind(this)
    this.onScanCancel = this.onScanCancel.bind(this)
    this.onScanSuccess = this.onScanSuccess.bind(this)
    this.renderField = this.renderField.bind(this)
    this.onRequestQrScan = this.onRequestQrScan.bind(this)
  }

  changeText (text, type) {
    const { values } = this.state
    this.setState({
      values: {
        ...values,
        [type]: text
      },
      error: undefined
    })
  }

  async addPayment () {
    const { token, user, shop, addShopPayment, togglePayment, shopPayments, paymentTypes } = this.props
    const { type, values } = this.state
    if (shopPayments.some(item => {
      const paymentType = paymentTypes.find(item => item.id === type)
      switch (paymentType.renderType) {
        case PAYMENT_TYPE.ELECTRIC:
          return (item.paymentTypeId === paymentType.id &&
            `${values.paymentAddress}`.trim() === `${item.paymentAddress}`.trim()
          )
        case PAYMENT_TYPE.COD:
          return item.paymentTypeId === paymentType.id
        case PAYMENT_TYPE.BANK:
          return item.paymentTypeId === paymentType.id &&
            `${values.accountName}`.trim() === `${item.accountName}`.trim() &&
            `${values.bankName}`.trim() === `${item.bankName}`.trim() &&
            `${values.branchName}`.trim() === `${item.branchName}`.trim() &&
            `${values.accountNumber}`.trim() === `${item.accountNumber}`.trim()
        default:
          return false
      }
    })) {
      return this.setState({
        error: 'Duplicate payment.'
      })
    }
    await addShopPayment(token, shop, user, {
      paymentTypeId: type,
      ...values
    })
    togglePayment()
  }

  onRequestQrScan () {
    Permissions.check('camera', 'always').then(response => {
      if (response === 'undetermined') {
        Permissions.request('camera', 'always')
          .then(response => {
            if (response === 'authorized') {
              this.setState({
                scan: true
              })
            }
          })
      } else if (response === 'denied') {
        Alert.alert(
          'Camera permission required',
          'User should grant camera permission for QR scan. Open setting and grant that permission',
          [
            { text: `Don't allow`, onPress: () => { }, style: 'cancel' },
            {
              text: `Open setting`,
              onPress: () => Permissions.canOpenSettings() && Permissions.openSettings()
            }
          ]
        )
      } else if (response === 'authorized') {
        this.setState({
          scan: true
        })
      }
    })
  }

  onScanSuccess (data) {
    const { values } = this.state
    this.setState({
      scan: false,
      values: {
        ...values,
        paymentAddress: data
      }
    })
  }

  onScanCancel () {
    this.setState({
      scan: false
    })
  }

  renderField () {
    const { paymentTypes } = this.props
    const { type } = this.state
    if (!type) {
      return null
    }
    const paymentType = paymentTypes.find(item => item.id === type)
    switch (paymentType.renderType) {
      case PAYMENT_TYPE.ELECTRIC:
        return [
          <FormLabel key='lable'>
            Address
          </FormLabel>,
          <View
            style={{ flexDirection: 'row' }}
            key='view'
          >
            <FormInput
              onChangeText={text => this.changeText(text, 'paymentAddress')}
              containerStyle={{ flex: 1 }}
              key='input'
              placeholder='Enter payment address'
            />
            <Icon
              name='qrcode-scan'
              size={34}
              type='material-community'
              onPress={this.onRequestQrScan}
              containerStyle={{ width: 45, marginRight: 15 }}
            />
          </View>
        ]
      case PAYMENT_TYPE.BANK:
        return [
          <FormLabel key='lable1'>
            Account name
          </FormLabel>,
          <FormInput
            key='input1'
            placeholder='Enter account name'
            onChangeText={text => this.changeText(text, 'accountName')}
          />,
          <View style={{ flexDirection: 'row' }} key='view'>
            <View style={{ flex: 1 }}>
              <FormLabel>
                Bank name
              </FormLabel>
              <FormInput
                placeholder='Enter bank name'
                onChangeText={text => this.changeText(text, 'bankName')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormLabel>
                Branch name
              </FormLabel>
              <FormInput
                placeholder='Enter branch name'
                onChangeText={text => this.changeText(text, 'branchName')}
              />
            </View>
          </View>,
          <FormLabel key='label2'>
            Account number
          </FormLabel>,
          <FormInput
            key='input2'
            placeholder='Enter account number'
            onChangeText={text => this.changeText(text, 'accountNumber')}
          />
        ]
      default:
        return null
    }
  }

  render () {
    const { error, type, scan } = this.state
    const { togglePayment, paymentTypes } = this.props
    if (scan) {
      return <QRScan
        cancelButtonTitle={'Cancel'}
        onSucess={this.onScanSuccess}
        onCancel={this.onScanCancel}
        cancelButtonVisible
        enableScanning />
    }
    return (
      <View style={{
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
      }}>
        <View style={{ width: '100%' }}>
          <HeaderTitle title='Payment method' onBack={togglePayment} />
        </View>
        <FormLabel>
          Payment Method
        </FormLabel>
        <Dropdown
          {
          ...type
            ? { value: type }
            : {}
          }
          onChangeText={(value) => this.setState({ type: value, error: undefined })}
          label='Payment Method'
          data={paymentTypes.map(item => {
            return {
              value: item.id,
              label: item.name.toUpperCase()
            }
          })}
          containerStyle={{ marginHorizontal: 20 }}
        />
        <ScrollView contentContainerStyle={{ width: '100%', height: 300 }}>
          {this.renderField()}
          {error && <FormValidationMessage>
            {error}
          </FormValidationMessage>}
          <Button
            title='SUBMIT'
            containerViewStyle={{ marginVertical: 10 }}
            onPress={this.addPayment} />
        </ScrollView>
      </View>
    )
  }
}

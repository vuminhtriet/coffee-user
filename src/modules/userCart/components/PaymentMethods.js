import React, { Component } from 'react'
import {
  Text,
  View,
  Image
} from 'react-native'
import {
  Card,
  Icon,
  Button,
  ListItem,
  FormLabel,
  FormInput
} from 'react-native-elements'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode'
import ImageResizer from 'react-native-image-resizer'
import { PAYMENT_METHODS } from '../../order/models'
// const ImagePicker = require('react-native-image-picker')
import ImagePicker from 'react-native-image-picker'

const options = {
  title: 'Upload your payment proof',
  storageOptions: {
    skipBackup: true,
    noData: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true
  }
}
export default class PaymentMethods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qrcode: null
    }
  }

  renderPaymentInfo = (payment) => {
    if (!payment.accountNumber && !payment.paymentAddress) {
      return null
    }
    else if (!payment.accountNumber) {
      return (
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
            onPress={() => this.setState({ qrcode: payment })}
            containerStyle={{ width: 45, marginRight: 15, marginTop: 10 }}
          />
        </View>
      )
    }
    else {
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
    }
  }

  getPaymentTitle = (payment) => {
    const { paymentTypes } = this.props
    const paymentType = paymentTypes.find(p => p.id === payment.paymentTypeId)

    return paymentType ? paymentType.name : ''
  }

  render() {
    const { qrcode, onSelectPaymentMethod } = this.state
    const {
      proofPayment,
      editable = false,
      shopPayments,
      selectPaymentMethod,
      userPayments,
      payments,
      paymentTypes
    } = this.props
    const paymentsIds = payments.map(payment => payment.id)

    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined,
        paddingBottom: 10
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 18 }}>
          Payment methods
        </FormLabel>
        {payments && payments.map((item, index) => {
          return [
            <ListItem
              key={index}
              title={this.getPaymentTitle(item)}
              onPress={() => selectPaymentMethod(item)}
              leftIcon={PAYMENT_METHODS[item.paymentTypeId]}
              rightTitleStyle={{ color: '#000' }}
              rightIcon={{
                color: item.isSelect
                  ? 'green' : undefined,
                name: 'check'
              }}
            />,
            this.renderPaymentInfo(item)
          ]
        })}
        <Modal
          onModalHide={() => this.setState({ qrcode: null })}
          isVisible={qrcode !== null}
          onBackdropPress={() => this.setState({ qrcode: null })}
          style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{ width: 250, height: 250 }}>
            <QRCode
              value={qrcode || ''}
              size={250}
            />
          </View>
        </Modal>
      </Card>
    )
  }
}

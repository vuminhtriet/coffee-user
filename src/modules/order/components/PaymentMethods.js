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
import { PAYMENT_METHODS } from '../models'
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
  constructor (props) {
    super(props)
    this.state = {
      qrcode: null
    }
    this.onChoose = this.onChoose.bind(this)
    this.renderPaymentInfo = this.renderPaymentInfo.bind(this)
    this.renderPaymentProof = this.renderPaymentProof.bind(this)
    this.renderPaymentProofView = this.renderPaymentProofView.bind(this)
  }
  onChoose (payment) {
    const { attactProof } = this.props
    ImagePicker.showImagePicker(options, (response) => {
      let fileName = null
      let fileUri = null
      let fileData = null
      // let fileOriginUri = null
      if (response.didCancel) {
        return false
      } else if (response.error) {
        return false
      } else if (response.customButton) {
        return false
      } else {
        fileName = response.fileName
        fileUri = response.uri
        // fileOriginUri = response.origURL
        fileData = response.data
      }
      if (!fileUri) {
        attactProof(payment, { data: fileData, value: fileName })
      }
      ImageResizer.createResizedImage(fileUri, 720, 1280, 'JPEG', 60)
        .then((response) => {
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
          attactProof(payment, { data: response, value: fileName })
        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
          attactProof(payment, { data: fileData, value: fileName })
        })
    })
  }
  renderPaymentProofView (payment) {
    if (!payment.paymentMethod || !payment.paymentMethod.type || !payment.proof) {
      return null
    }
    switch (payment.paymentMethod.type) {
      case 'crypto':
        return (
          <View
            style={{ flexDirection: 'row', width: '100%' }}
            key='view_proof'
          >
            <FormInput
              multiline
              value={(payment.proof && payment.proof.data) || ''}
              numberOfLines={3}
              editable={false}
              placeholder={'Your payment transaction url'}
            />
          </View>
        )
      case 'bank':
        return (
          <Image
            style={{
              width: 100,
              height: 100
            }}
            resizeMode='contain'
            source={{ uri: payment.proof.value }}
          />
        )
      default:
        return null
    }
  }
  renderPaymentProof (payment) {
    const { attactProof } = this.props
    if (!payment.paymentMethod && !payment.paymentMethod.type) {
      return null
    }
    switch (payment.paymentMethod.type) {
      case 'crypto':
        return (
          <View
            style={{ flexDirection: 'row', width: '100%' }}
            key='view_proof'
          >
            <FormInput
              multiline
              value={(payment.proof && payment.proof.data) || ''}
              numberOfLines={3}
              placeholder={'Your payment transaction url'}
              onChangeText={(text) => attactProof(payment, { data: text })}
            />
          </View>
        )
      case 'bank':
        return (
          <Button
            key='bank_proof'
            title={(payment.proof && payment.proof.value) || 'Attached file'}
            onPress={() => this.onChoose(payment)}
            backgroundColor={(payment.proof && payment.proof.value) ? 'green' : undefined}
            buttonStyle={{
              marginVertical: 5
            }}
          />
        )
      default:
        return null
    }
  }
  renderPaymentInfo (payment) {
    if (!payment.paymentMethod && !payment.paymentMethod.type) {
      return null
    }
    const values = payment.value ? JSON.parse(payment.value) : {}
    switch (payment.paymentMethod.type) {
      case 'crypto':
        return [
          <View
            style={{ flexDirection: 'row', width: '100%' }}
            key='view'
          >
            <FormLabel containerStyle={{ flex: 1 }} key='lable'>
              {values.address}
            </FormLabel>
            <Icon
              name='qrcode-scan'
              size={34}
              type='material-community'
              onPress={() => this.setState({ qrcode: payment.value })}
              containerStyle={{ width: 45, marginRight: 15, marginTop: 10 }}
            />
          </View>
        ]
      case 'bank':
        return [
          <FormLabel key='lable1'>
            Account name: {values.name}
          </FormLabel>,
          <FormLabel key='lable2'>
            Bank name: {values.bank}
          </FormLabel>,
          <FormLabel key='lable3'>
            Branch name: {values.branch}
          </FormLabel>,
          <FormLabel key='label4'>
            Account number: {values.number}
          </FormLabel>
        ]
      default:
        return null
    }
  }
  render () {
    const { qrcode } = this.state
    const {
      proofPayment,
      payments = [],
      title = '',
      editable = false,
      shopPayments,
      selectePaymentMethod
    } = this.props
    const paymentsIds = payments.map(payment => payment.id)
    return (
      <Card containerStyle={{
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: undefined,
        height: undefined }}>
        {title && <Text
          style={{ color: '#6F4E37', padding: 5, fontWeight: 'bold' }}>
          {title}
        </Text>}
        {!editable
          ? payments && payments.map((payment, index) => {
            return [
              <ListItem
                key={index}
                title={payment.paymentMethod.name}
                leftIcon={PAYMENT_METHODS[payment.paymentMethod.type]}
                rightTitleStyle={{ color: '#000' }}
                rightIcon={{ name: 'check', color: 'green' }}
              />,
              this.renderPaymentInfo(payment),
              proofPayment
                ? this.renderPaymentProof(payment)
                : this.renderPaymentProofView(payment)
            ]
          }) : shopPayments && shopPayments.map((payment, index) => {
            return [
              <ListItem
                key={index}
                title={payment.paymentMethod.name}
                onPress={() => selectePaymentMethod(payment, index)}
                leftIcon={PAYMENT_METHODS[payment.paymentMethod.type]}
                rightTitleStyle={{ color: '#000' }}
                rightIcon={{
                  color: paymentsIds.includes(payment.id)
                  ? 'green' : undefined,
                  name: 'check'
                }}
              />,
              this.renderPaymentInfo(payment)
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

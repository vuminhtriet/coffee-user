import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert
} from 'react-native'
import {
  Icon,
  ListItem,
  FormLabel,
  Card
} from 'react-native-elements'
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode'
import { PAYMENT_TYPE } from '../../../common/models'

export default class StorePayment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qrcode: null
    }
  }

  setClipboardContent = (msg) => {
    Clipboard.setString(msg);
    Alert.alert(
      '',
      'Text has been already copied.'
    )
  };

  renderPayments(payment) {
    if (!payment || !payment.paymentType) {
      return null
    }
    switch (payment.paymentType.renderType) {
      case PAYMENT_TYPE.ELECTRIC:
        return (
          <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 30, paddingTop: 5, paddingBottom: 10 }}>
            <Text style={{ flex: 1, paddingTop: 8 }} selectable={true} onPress={() => this.setClipboardContent(payment.paymentAddress)}>
              {payment.paymentAddress}
            </Text>
            <Icon
              name='qrcode-scan'
              size={34}
              type='material-community'
              onPress={() => this.setState({ qrcode: payment.paymentAddress })}
              containerStyle={{ paddingRight: 10 }}
            />
          </View>
        )
      case PAYMENT_TYPE.BANK:
        return (
          <View style={{ flex: 1, paddingLeft: 30, paddingTop: 5 }}>
            <Text selectable={true} style={{ paddingBottom: 10, flex: 1 }}>
              Account name: {payment.accountName}
            </Text>
            <Text selectable={true} style={{ paddingBottom: 10, flex: 1 }}>
              Bank name: {payment.bankName}
            </Text>
            <Text selectable={true} style={{ paddingBottom: 10, flex: 1 }}>
              Branch name: {payment.branchName}
            </Text>
            <Text selectable={true} style={{ paddingBottom: 10, flex: 1 }} onPress={() => this.setClipboardContent(payment.accountNumber)}>
              Account number: {payment.accountNumber}
            </Text>
          </View>
        )
      default:
        return null
    }
  }

  render() {
    const { shop, paymentTypes } = this.props
    const { qrcode } = this.state
    if (!shop) {
      return null
    }
    return (
      <View
        style={{
          marginTop: 7,
          paddingTop: 7,
          paddingBottom: 7,
          width: '100%',
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: '#fff'
        }}
        removeClippedSubviews={false}
      >
        <Text style={{ fontSize: 16, paddingBottom: 3, color: '#000', fontWeight: 'bold' }}>
          Payment information
        </Text>
        {/* <View> */}
        {shop.shopPaymentMethods && shop.shopPaymentMethods.map(item => {
          const paymentType = paymentTypes.find(elem => elem.id === item.paymentTypeId)
          if (!paymentType) {
            return null
          }
          return [
            <ListItem
              key={item.id}
              title={`${paymentType.name}`.toLocaleUpperCase()}
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0, marginLeft: -10 }}
            />,
            this.renderPayments(item)
          ]
        })}
        {/* </View> */}
        <Modal
          onModalHide={() => this.setState({ qrcode: null })}
          isVisible={qrcode !== null}
          transparent
          onBackdropPress={() => this.setState({ qrcode: null })}
          onBackButtonPress={() => this.setState({ qrcode: null })}
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
      </View>
    )
  }
}

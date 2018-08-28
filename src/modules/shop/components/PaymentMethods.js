import React, { Component } from 'react'
import {
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native'
import {
  Card,
  Icon,
  ListItem,
  FormLabel
} from 'react-native-elements'
import QRCode from 'react-native-qrcode'
import { PAYMENT_TYPE } from '../../../common/models'
import { groupBy, toPairs, sortBy, map } from 'lodash'

export default class PaymentMethods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qrcode: null
    }
  }

  renderPayments = (payment) => {
    return (
      payment.map(item => {
        return [
          <ListItem
            key={item.id}
            hideChevron
            title={item.paymentType.name}
          >
          </ListItem>,
          this.renderUserPayments(item.userPaymentMethod)
        ]
      })
    )
  }

  renderUserPayments = (userPayment) => {
    if (!userPayment) {
      return null
    }
    else if (userPayment.accountNumber) {
      return (
        // <ListItem
        //   title={userPayment.accountNumber + ' - ' + userPayment.accountName}
        //   hideChevron={true}
        // />
        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 30, paddingTop: 10 }}>
          <Text style={{ flex: 1 }} selectable={true}>
            {userPayment.accountNumber + ' - ' + userPayment.accountName}
          </Text>
        </View>
      )
    }
    else if (userPayment.paymentAddress) {
      return (
        // <ListItem
        //   title={userPayment.paymentAddress}
        //   rightIcon={<Icon
        //     name='qrcode-scan'
        //     size={34}
        //     type='material-community'
        //     onPress={() => this.setState({ qrcode: userPayment.paymentAddress })}
        //   />}
        // />
        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 30, paddingTop: 10 }}>
          <Text style={{ flex: 1, paddingTop: 8 }} selectable={true}>
            {userPayment.paymentAddress}
          </Text>
          <Icon
            name='qrcode-scan'
            size={34}
            type='material-community'
            onPress={() => this.setState({ qrcode: userPayment.paymentAddress })}
            containerStyle={{ paddingRight: 10 }}
          />
        </View>
      )
    }
    else {
      return null
    }
  }

  render() {
    const { payments } = this.props
    const { qrcode } = this.state
    const paymentLst = payments && payments.length > 0
      ? map(sortBy(toPairs(groupBy(payments, 'currencyUnitId')), item => item[0]), item => item[1])
      : []
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        paddingBottom: 10,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Payment methods
        </FormLabel>
        {paymentLst && paymentLst.map((item, index) => {
          return [
            <FormLabel
              key={index}
              containerStyle={{ padding: 0, margin: 0 }}
              labelStyle={{ color: '#000', padding: 0, fontSize: 16 }}>
              {item[0].currencyUnit.code} payment
            </FormLabel>,
            this.renderPayments(item)
          ]
        })}
        <Modal
          onModalHide={() => this.setState({ qrcode: null })}
          visible={qrcode !== null}
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
      </Card>
    )
  }
}

import React, { Component } from 'react'
import {
  View,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  Text
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
        //   hideChevron
        //   containerStyle={{ paddingLeft: 10, borderBottomWidth: 0, borderTopWidth: 0 }}
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
        //     containerStyle={{}}
        //   />}
        //   containerStyle={{ paddingLeft: 10, borderBottomWidth: 0, borderTopWidth: 0 }}
        // /> ,
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

  renderEditablePayments = (amount, shopPayments, userPayments, payments) => {
    const paymentTypes = shopPayments
      .filter(item => item.paymentType && item.paymentType.currencyUnits.find(elem => elem.id === amount.currencyUnitId))
      .reduce((result, item) => {
        const paymentType = result.find(elem => elem.paymentTypeId === item.paymentTypeId)
        if (paymentType) {
          return result
        }
        else {
          return [...result, item]
        }
      }, [])
    const selectedPayment = payments
      .find(item => item.paymentType.renderType === PAYMENT_TYPE.COD)

    return (
      paymentTypes.map(item => {
        const lstPayments = userPayments
          .filter(elem => elem.paymentType && elem.paymentTypeId === item.paymentTypeId)
        return [
          <ListItem
            key={item.id}
            title={item.paymentType.name}
            onPress={() => item.paymentType.renderType === PAYMENT_TYPE.COD
              ? this.selectUserPayment(item, amount.currencyUnitId)
              : lstPayments.length === 0
                ? Alert.alert(
                  'Info',
                  'Please add your payment information if you choose this one.',
                  [
                    { text: 'OK', onPress: () => { } }
                  ]
                )
                : console.log()}
            rightIcon={item.paymentType.renderType === PAYMENT_TYPE.COD
              ?
              {
                color: selectedPayment && selectedPayment.id === item.id
                  ? 'green'
                  : undefined,
                name: 'check'
              }
              : undefined
            }
            hideChevron={item.paymentType.renderType !== PAYMENT_TYPE.COD}
            containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
          >
          </ListItem>,
          this.renderEditableUserPayments(amount, item.paymentType, userPayments, payments)
        ]
      })
    )
  }

  renderEditableUserPayments = (amount, paymentType, userPayments, payments) => {
    const lstPayments = userPayments
      .filter(item => item.paymentType && item.paymentTypeId === paymentType.id)
    const selectedPayment = payments
      .find(item => item.paymentTypeId === paymentType.id)

    if (paymentType.renderType === PAYMENT_TYPE.BANK) {
      return (
        lstPayments.map(item => {
          return (
            // <ListItem
            //   title={item.accountNumber + ' - ' + item.accountName}
            //   onPress={() => this.selectUserPayment(item, amount.currencyUnitId)}
            //   rightIcon={{
            //     color: selectedPayment && selectedPayment.id === item.id
            //       ? 'green'
            //       : undefined,
            //     name: 'check'
            //   }}
            //   containerStyle={{ paddingLeft: 10, borderBottomWidth: 0, borderTopWidth: 0 }}
            // />
            <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 30, paddingTop: 10 }}>
              <Text style={{ flex: 1, paddingTop: 5 }} selectable={true}>
                {item.accountNumber + ' - ' + item.accountName}
              </Text>
              <Icon
                name='check'
                color={selectedPayment && selectedPayment.id === item.id
                  ? 'green'
                  : '#bdc6cf'}
                size={28}
                onPress={() => this.selectUserPayment(item, amount.currencyUnitId)}
                containerStyle={{ paddingRight: 10 }}
              />
            </View>
          )
        })
      )
    }
    else if (paymentType.renderType === PAYMENT_TYPE.ELECTRIC) {
      return (
        lstPayments.map(item => {
          return (
            // <ListItem
            //   title={item.paymentAddress}
            //   onPress={() => this.selectUserPayment(item, amount.currencyUnitId)}
            //   rightIcon={{
            //     color: selectedPayment && selectedPayment.id === item.id
            //       ? 'green'
            //       : undefined,
            //     name: 'check'
            //   }}
            //   containerStyle={{ paddingLeft: 10, borderBottomWidth: 0, borderTopWidth: 0 }}
            // />
            <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 30, paddingTop: 10 }}>
              <Text style={{ flex: 1, paddingTop: 5 }} selectable={true}>
                {item.paymentAddress}
              </Text>
              <Icon
                name='check'
                color={selectedPayment && selectedPayment.id === item.id
                  ? 'green'
                  : '#bdc6cf'}
                size={28}
                onPress={() => this.selectUserPayment(item, amount.currencyUnitId)}
                containerStyle={{ paddingRight: 10 }}
              />
            </View>
          )
        })
      )
    }
    else {
      return null
    }
  }

  selectUserPayment = (item, currencyUnitId) => {
    const { selectUserPayment } = this.props
    selectUserPayment(item, currencyUnitId)
  }

  render() {
    const { payments, editable = false, amounts, userPayments, shopPayments } = this.props
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
        <View style={{ flexDirection: 'row' }}>
          <FormLabel
            containerStyle={{ padding: 0, margin: 0, flex: 1 }}
            labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
            Payment methods
          </FormLabel>
          <Icon
            name='edit'
            color='#6F4E37'
            containerStyle={{ paddingRight: 10, paddingTop: 10 }}
          />
        </View>
        {!editable && paymentLst && paymentLst.map((item, index) => {
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
        {editable && amounts && amounts.map(item => {
          return [
            <FormLabel
              key={item.currencyUnitId}
              containerStyle={{ padding: 0, margin: 0 }}
              labelStyle={{ color: '#000', padding: 0, fontSize: 16 }}>
              Choose {item.currencyUnit.code} payment
            </FormLabel>,
            this.renderEditablePayments(item, shopPayments, userPayments, payments)
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

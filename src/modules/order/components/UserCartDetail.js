import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import {
  Icon,
  Button,
  FormLabel
} from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import Details from './Details'
import General from './General'
import Shipment from './Shipment'
import Delivery from '../containers/Delivery'
import AdditionalFees from '../containers/AdditionalFees'
import PaymentMethods from './PaymentMethods'
import UserNote from './UserNote'
import ShopNote from './ShopNote'
import { CART_STATUS } from '../models'

export default class UserCartDetail extends Component {
  constructor (props) {
    super(props)
    const { order } = props
    this.state = {
      order
    }

    this.addFee = this.addFee.bind(this)
    this.confirm = this.confirm.bind(this)
    this.attactProof = this.attactProof.bind(this)
    this.renderStatus = this.renderStatus.bind(this)
    this.onChangeNote = this.onChangeNote.bind(this)
    this.onProductChange = this.onProductChange.bind(this)
    this.selecteDelivery = this.selecteDelivery.bind(this)
    this.onChangeUserNote = this.onChangeUserNote.bind(this)
    this.selectePaymentMethod = this.selectePaymentMethod.bind(this)
    this.onChangeShipmentInfo = this.onChangeShipmentInfo.bind(this)
  }

  attactProof (payment, { data, value }) {
    const { order } = this.state
    order.payments = order.payments.map(item => {
      if (item.id === payment.id) {
        return {
          ...payment,
          proof: {
            data,
            value
          }
        }
      }
      return item
    })

    this.setState({
      order: {
        ...order,
        payments: [
          ...order.payments
        ]
      }
    })
  }

  addFee ({feeName, feeAmount, feeUnit, feeDescription}) {
    const { order } = this.state
    order.fees.push({
      name: feeName,
      amount: feeAmount,
      unit: feeUnit,
      description: feeDescription
    })
    this.setState({
      order: { ...order }
    })
  }

  confirm () {
    const { confirmCart } = this.props
    const { order } = this.state
    order.status = 1
    confirmCart(order)
  }

  selecteDelivery (item, index) {
    const { order } = this.state
    order.delivery = item
    this.setState({
      order: { ...order }
    })
  }

  selectePaymentMethod (item, itemIndex) {
    const { order } = this.state
    const index = order.payments.findIndex(payment => payment.id === item.id)
    if (index !== -1) {
      order.payments.splice(index, 1)
    } else {
      order.payments.push(item)
    }

    this.setState({
      order: {
        ...order,
        payments: [
          ...order.payments
        ]
      }
    })
  }

  onChangeUserNote (note) {
    const { order } = this.state
    order.userNode = note
    this.setState({
      order: { ...order }
    })
  }

  onChangeNote (note) {
    const { order } = this.state
    order.shopNode = note
    this.setState({
      order: { ...order }
    })
  }

  onProductChange (detail, index, quantity) {
    const { order } = this.state
    order.details[index].quantity = quantity
    this.setState({
      order: {
        ...order,
        details: [
          ...order.details
        ]
      }
    })
  }

  onChangeShipmentInfo ({ type, text }) {
    const { order } = this.state
    this.setState({
      order: {
        ...order,
        shipment: {
          ...order.shipment,
          [type]: text
        }
      }
    })
  }

  renderStatus () {
    const { order } = this.state
    const icon = {
    }
    switch (order.status) {
      case 5:
      case 0:
        icon.name = 'shopping-basket'
        break
      case 1:
        icon.name = 'access-time'
        break
      case 2:
      case 4:
        icon.name = 'check-circle'
        icon.color = 'green'
        break
      case 3:
        icon.name = 'assignment-return'
        break
    }
    return [
      <Icon
        key='icon'
        size={24}
        color='#E44C4C'
        {...icon}
      />,
      <FormLabel key='label' labelStyle={{ fontSize: 10, maxWidth: 100, textAlign: 'center', marginTop: 0 }}>
        {CART_STATUS[order.status]}
      </FormLabel>
    ]
  }

  render () {
    const { order } = this.state
    const { onBack } = this.props
    return (
      <DefaultPage style={{ flexDirection: 'row' }}>
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Cart detail'
            onBack={onBack} />
        </View>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ width: '100%', flex: 1 }}
        >
          <ScrollView style={{ width: '100%', height: '100%' }}>
            <General
              id={order.id}
              date={order.date}
              status={order.status}
              userStatus={order.userStatus}
              proofs={order.proofs}
              user={{
                name: order.shop.shopName
              } || {}}
              statusInformation={false}
              statusComponent={this.renderStatus()}
            />
            <Details
              editable={order.status === 0 || order.status === 5}
              details={order.details}
              quantity={order.quantity}
              total={order.total}
              onProductChange={this.onProductChange}
            />
            <Shipment
              editable={order.status === 0 || order.status === 5}
              shipment={order.shipment}
              onChangeShipmentInfo={this.onChangeShipmentInfo}
            />
            {order.status !== 0 && <AdditionalFees
              addFee={this.addFee}
              fees={order.fees}
            />}
            <View
              style={{
                width: '100%',
                backgroundColor: '#EFF1F4',
                borderColor: '#989999',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                flexDirection: 'row',
                padding: 10
              }}
            >
              <Text style={{ width: 80, fontSize: 22, fontWeight: 'bold', color: '#1A86E0' }}>
                Total
              </Text>
              <Text style={{ flex: 1, fontSize: 22, color: '#E55554', textAlign: 'right' }}>
                {order.totalAmount}
              </Text>
            </View>
            <PaymentMethods
              editable={order.status === 0 || order.status === 5}
              title={(order.status === 0 || order.status === 5)
                ? 'Select Payment methods'
                : 'Payment methods'
              }
              payments={order.payments}
              shopPayments={(order.shop && order.shop.shopPayments)
                ? order.shop.shopPayments : []
              }
              proofPayment={order.status === 2}
              selectePaymentMethod={this.selectePaymentMethod}
              attactProof={this.attactProof}
            />
            <UserNote
              editable={order.status === 0 || order.status === 5}
              note={order.userNode || undefined}
              placeHolder='Type your note'
              onChangeNote={this.onChangeUserNote}
            />
            {order.status !== 0 && <ShopNote
              note={order.shopNode || undefined}
              placeHolder='Type your note'
              editable={order.status === 1}
              onChangeNote={order.status === 1
                ? this.onChangeNote
                : null
              }
            />}
            <View style={{ flexDirection: 'column', width: undefined, height: 80 }}>
              {order.status !== 1 && <Button
                title={order.status === 2 ? 'Checkout' : 'Confirm'}
                backgroundColor='green'
                containerViewStyle={{ flex: 1, padding: 5 }}
                onPress={this.confirm}
              />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </DefaultPage>)
  }
}

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

export default class ShopCartDetail extends Component {
  constructor (props) {
    super(props)
    const { order } = props
    this.state = {
      order
    }

    this.addFee = this.addFee.bind(this)
    this.reject = this.reject.bind(this)
    this.confirm = this.confirm.bind(this)
    this.requestChange = this.requestChange.bind(this)
    this.renderStatus = this.renderStatus.bind(this)
    this.onChangeNote = this.onChangeNote.bind(this)
    this.onProductChange = this.onProductChange.bind(this)
    this.selecteDelivery = this.selecteDelivery.bind(this)
    this.onChangeShipmentInfo = this.onChangeShipmentInfo.bind(this)
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
    const { order } = this.state
    const { confirmCart } = this.props
    order.status = 2
    confirmCart(order)
  }

  reject () {
    const { order } = this.state
    const { confirmCart } = this.props
    order.status = 3
    confirmCart(order)
  }

  requestChange () {
    const { order } = this.state
    const { confirmCart } = this.props
    order.status = 5
    confirmCart(order)
  }

  selecteDelivery (item, index) {
    const { order } = this.state
    order.delivery = item
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
      order: { ...order }
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
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }}>
            <General
              id={order.id}
              date={order.date}
              status={order.status}
              userStatus={order.userStatus}
              proofs={order.proofs}
              user={order.user}
              statusInformation={false}
              statusComponent={this.renderStatus()}
            />
            <Details
              details={order.details}
              quantity={order.quantity}
              total={order.total}
              onProductChange={this.onProductChange}
            />
            <Shipment
              shipment={order.shipment}
              onChangeShipmentInfo={this.onChangeShipmentInfo}
            />
            <AdditionalFees
              addFee={this.addFee}
              editable={order.status === 1}
              fees={order.fees}
            />
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
              <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold', color: '#1A86E0' }}>
                Total
              </Text>
              <Text style={{ flex: 1, fontSize: 22, color: '#E55554', textAlign: 'right' }}>
                {order.totalAmount}
              </Text>
            </View>
            <PaymentMethods
              title='User Payment methods'
              payments={order.payments}
            />
            <Delivery
              editable={order.status === 1}
              delivery={order.delivery || {}}
              selecteDelivery={this.selecteDelivery}
            />
            <UserNote
              note={order.userNode || 'No note'} />
            <ShopNote
              note={order.shopNode || undefined}
              placeHolder='Type your note'
              editable
              onChangeNote={this.onChangeNote}
            />
            <View style={{ flexDirection: 'column', width: undefined, height: undefined, paddingVertical: 10 }}>
              <Button
                title='Reject'
                backgroundColor='#E44C4B'
                containerViewStyle={{ flex: 1, padding: 5, height: 40, marginVertical: 5 }}
                onPress={this.reject}
              />
              <Button
                title='Request change'
                backgroundColor='#6F4E37'
                containerViewStyle={{ flex: 1, padding: 5, height: 40, marginVertical: 5 }}
                onPress={this.requestChange}
              />
              <Button
                title='Confirm'
                backgroundColor='green'
                containerViewStyle={{ flex: 1, padding: 5, height: 40, marginVertical: 5 }}
                onPress={this.confirm}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </DefaultPage>)
  }
}

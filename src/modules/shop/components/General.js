import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native'
import {
  Card,
  Icon,
  FormLabel,
  Avatar,
  ListItem,
  Button
} from 'react-native-elements'
import { SHIPPING_STATUS_MAP, PAYMENT_STATUS_MAP, PAYMENT_STATUS } from '../../../common/models'
import ShippingStatus from './ShippingStatus'
import PaymentStatus from './PaymentStatus';
import ProofList from './ProofList';
import moment from 'moment';
import { ORDER_STATUS } from '../../../common/models';

export default class General extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalShippingStatus: false,
      modalPaymentStatus: false,
      modalProofs: false
    }
  }

  requestChangeShippingStatus = () => {
    const { modalShippingStatus } = this.state
    this.setState({
      shippingStatus: null,
      modalShippingStatus: !modalShippingStatus
    })
  }

  requestChangePaymentStatus = () => {
    const { modalPaymentStatus } = this.state
    this.setState({
      paymentStatus: null,
      modalPaymentStatus: !modalPaymentStatus
    })
  }

  requestChangeProofs = () => {
    const { modalProofs } = this.state
    this.setState({
      modalProofs: !modalProofs
    })
  }

  onChangeShippingStatus = (status) => {
    const { onChangeShippingStatus } = this.props
    onChangeShippingStatus(status)
    this.setState({
      shippingStatus: status,
      modalShippingStatus: false
    })
  }

  onChangePaymentStatus = (status) => {
    const { onChangePaymentStatus } = this.props
    onChangePaymentStatus(status)
    this.setState({
      paymentStatus: status,
      modalPaymentStatus: false
    })
  }

  onShippingBack = () => {
    this.setState({
      modalShippingStatus: false
    })
  }
  onPaymentBack = () => {
    this.setState({
      modalPaymentStatus: false
    })
  }

  onProofsBack = () => {
    this.setState({
      modalProofs: false
    })
  }

  onImageUpload = (image) => {
    const { onImageUpload } = this.props
    onImageUpload(image)
  }

  render() {
    const { modalShippingStatus, modalPaymentStatus, modalProofs } = this.state
    const {
      id,
      date,
      status,
      user,
      shop,
      payments,
      paymentStatus,
      shippingStatus,
      statusComponent,
      isUser,
      images,
      cover,
      completeOrder,
      removeProof,
      removeImage
    } = this.props
    const isProof = payments.find(p => p.proofs.length > 0)
    const finalPaymentStatus = this.state.paymentStatus ? this.state.paymentStatus : paymentStatus
    return [
      <Card
        key='information'
        containerStyle={{
          margin: 0,
          padding: 0,
          width: undefined,
          height: undefined
        }}>
        <View
          style={{ position: 'absolute', right: -10, top: 10 }}
        >
          {statusComponent.map(item => item)}
        </View>
        {id && <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', fontSize: 22, padding: 0 }}>
          OrderID: {id}
        </FormLabel>}
        <FormLabel
          containerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        >
          Order date: {moment(date).format("LLL")}
        </FormLabel>
        <TouchableOpacity
          style={{
            width: undefined,
            height: 60,
            flexDirection: 'row',
            margin: 15,
            paddingLeft: 5
          }}
        >
          <Avatar
            medium
            rounded
            source={cover && cover.fullUrl
              ? { uri: cover.fullUrl }
              : require('../../../assets/placeholder.png')
            }
          />
          <View
            style={{
              flex: 1,
              height: 60,
              flexDirection: 'column',
              paddingHorizontal: 20,
              paddingVertical: 0
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              {!isUser ? user.displayName : shop.name}
            </Text>
            <Text style={{
              color: user.online === 0 ? '#E44C4C' : '#6F4E37',
              fontSize: 14
            }}>
              {'Online'}
            </Text>
          </View>
          <Icon
            name='navigate-next'
            size={30}
            containerStyle={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </Card>,
      <Card
        key='status'
        containerStyle={{
          margin: 0,
          padding: 0,
          width: undefined,
          height: undefined
        }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Order status
        </FormLabel>
        <ListItem
          key='shipping-status'
          leftIcon={{
            name: 'local-shipping'
          }}
          rightIcon={{
            name: 'pencil',
            type: 'foundation'
          }}
          hideChevron={isUser ? true : false}
          disabled={isUser ? true : false}
          onPress={this.requestChangeShippingStatus}
          title='Shipping status'
          containerStyle={{ marginLeft: 10, marginRight: 10 }}
          rightTitle={
            this.state.shippingStatus
              ? SHIPPING_STATUS_MAP[this.state.shippingStatus]
              : SHIPPING_STATUS_MAP[shippingStatus]
          }
        />
        <ListItem
          key='payment-status'
          leftIcon={{
            name: 'money',
            type: 'font-awesome'
          }}
          rightIcon={{
            name: 'pencil',
            type: 'foundation'
          }}
          hideChevron={isUser ? true : false}
          disabled={isUser ? true : false}
          onPress={this.requestChangePaymentStatus}
          title='Payment status'
          containerStyle={{ marginLeft: 10, marginRight: 10 }}
          rightTitle={
            !isUser
              ? PAYMENT_STATUS_MAP[finalPaymentStatus]
              : finalPaymentStatus === PAYMENT_STATUS.TO_BE_CONFIRMED
                ? 'Waiting for payment proof'
                : finalPaymentStatus === PAYMENT_STATUS.PAID
                  ? 'Valid'
                  : PAYMENT_STATUS_MAP[finalPaymentStatus]
          }
        />
        {!isUser && <ListItem
          key='payment-proof'
          leftIcon={{
            name: 'certificate',
            type: 'font-awesome'
          }}
          hideChevron={isProof ? false : true}
          onPress={this.requestChangeProofs}
          title='Payment proof'
          containerStyle={{ marginLeft: 10, marginRight: 10 }}
          rightTitle={`${isProof ? 'Submitted' : 'None'}`}
        />}
      </Card>,
      isUser &&
      <View style={{ width: '100%', flex: 1 }}>
        <Button
          title='Add payment proof'
          backgroundColor='#E64B47'
          containerViewStyle={{ width: '90%', marginVertical: 10 }}
          onPress={this.requestChangeProofs}
          titleStyle={{ fontSize: 18 }}
        />
        {images && images.length > 0 &&
          <Text style={{ paddingHorizontal: 15 }}>
            Please press the update button to submit proof
          </Text>
        }
      </View>,
      !isUser &&
      <View style={{ width: '100%', flex: 1 }}>
        <Button
          title='Complete order'
          backgroundColor='#E64B47'
          containerViewStyle={{ width: '90%', marginVertical: 10 }}
          onPress={completeOrder}
          titleStyle={{ fontSize: 18 }}
          disabled={status === ORDER_STATUS.COMPLETE || status < 0}
        />
      </View>,
      <Modal
        key='modal-shipping-status'
        animationType='none'
        transparent
        visible={modalShippingStatus}
      >
        <ShippingStatus
          shippingStatus={shippingStatus}
          orderStatus={status}
          setStatus={this.onChangeShippingStatus}
          onBack={this.onShippingBack}
        />
      </Modal>,
      <Modal
        key='modal-payment-status'
        animationType='none'
        transparent
        visible={modalPaymentStatus}
      >
        <PaymentStatus
          paymentStatus={paymentStatus}
          setStatus={this.onChangePaymentStatus}
          onBack={this.onPaymentBack}
        />
      </Modal>,
      <Modal
        key='modal-proofs'
        animationType='none'
        transparent
        visible={modalProofs}
      >
        <ProofList
          onImageUpload={this.onImageUpload}
          images={images}
          data={payments}
          onBack={this.onProofsBack}
          isUser={isUser}
          paymentStatus={paymentStatus}
          removeImage={removeImage}
          removeProof={removeProof}
        />
      </Modal>
    ]
  }
}

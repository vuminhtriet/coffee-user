import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native'
import { Icon, ListItem, FormLabel } from 'react-native-elements'
import QRCode from 'react-native-qrcode'
import { PAYMENT_TYPE } from '../../../common/models'

export default class UserPaymentMethod extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      qrcode: null
    }

    this.onLoadMore = this.onLoadMore.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.deleteUserPayment = this.deleteUserPayment.bind(this)
    this.renderPaymentInfo = this.renderPaymentInfo.bind(this)
  }

  keyExtractor (item, index) {
    return index
  }

  onRefresh () {

  }

  onLoadMore () {

  }

  renderPaymentInfo (payment, paymentType) {
    if (!paymentType || !payment) {
      return null
    }
    switch (paymentType.renderType) {
      case PAYMENT_TYPE.ELECTRIC:
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
      case PAYMENT_TYPE.BANK:
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

  async deleteUserPayment (payment) {
    const {
      token,
      user,
      getUserInformation,
      deleteUserPaymentMethod
    } = this.props
    await deleteUserPaymentMethod(token, user, payment)
    await getUserInformation(token, user.id)
  }

  render () {
    const { userPayments, paymentTypes } = this.props
    const { refreshing, qrcode } = this.state
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          padding: 10,
          flex: 1
        }}
      >
        <FlatList
          key='data'
          data={userPayments}
          refreshing={refreshing}
          keyExtractor={(item, index) => this.keyExtractor(item, index)}
          renderItem={({ item, index }) => {
            const paymentType = paymentTypes.find(type => type.id === item.paymentTypeId)
            if (!paymentType) {
              return null
            }
            return [
              <ListItem
                key={item.id}
                title={`${paymentType.name}`.toLocaleUpperCase()}
                rightTitleNumberOfLines={10}
                rightIcon={{ name: 'delete', color: '#E44C4C', type: 'material-community' }}
                onPressRightIcon={() => this.deleteUserPayment(item)}
                containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
              />,
              this.renderPaymentInfo(item, paymentType)
            ]
          }}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
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
      </View>
    )
  }
}

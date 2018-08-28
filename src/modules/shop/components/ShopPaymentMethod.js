import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Text
} from 'react-native'
import { Icon, ListItem, FormLabel } from 'react-native-elements'
import QRCode from 'react-native-qrcode'
import { PAYMENT_TYPE } from '../../../common/models'

export default class ShopPaymentMethod extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      qrcode: null
    }
  }

  keyExtractor = (item, index) => {
    return index
  }

  onRefresh = () => {

  }

  onLoadMore = () => {

  }

  renderPaymentInfo = (payment, paymentType) => {
    if (!paymentType || !payment) {
      return null
    }
    switch (paymentType.renderType) {
      case PAYMENT_TYPE.ELECTRIC:
        return (
          <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 30, paddingTop: 5, paddingBottom: 10 }}>
            <Text style={{ flex: 1, paddingTop: 8 }} selectable={true}>
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
            <Text selectable={true} style={{ paddingBottom: 10, flex: 1 }}>
              Account number: {payment.accountNumber}
            </Text>
          </View>
        )
      default:
        return null
    }
  }

  deleteShopPayment = async (paymentId) => {
    const {
      token,
      shopId,
      deleteShopPaymentMethod
    } = this.props
    await deleteShopPaymentMethod(token, shopId, paymentId)
  }

  render() {
    const { shopPayments, paymentTypes } = this.props
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
          data={shopPayments}
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
                onPressRightIcon={() => this.deleteShopPayment(item.id)}
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

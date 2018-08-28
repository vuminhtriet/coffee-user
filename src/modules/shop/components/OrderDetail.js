import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native'
import {
  Icon,
  FormLabel
} from 'react-native-elements'
import Details from './Details'
import General from './General'
import ShippingInfo from './ShippingInfo'
import Delivery from './Delivery'
import AdditionalFees from './AdditionalFees'
import PaymentMethods from './PaymentMethods'
import UserNote from './UserNote'
import ShopNote from './ShopNote'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubMenu from '../containers/SubMenu';
import {
  SHIPPING_STATUS,
  PAYMENT_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_MAP
} from '../../../common/models';
import { mapSeries } from 'async';
import { uploadProofImage } from '../../../common/firebase';
import moment from 'moment';

export default class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      loading: true,
      refreshing: false
    }
  }

  async componentDidMount() {
    const { getOrderDetail, id, token, onBack, getOrders } = this.props
    id && token && await getOrderDetail(id, token)
    // const { order } = this.props
    // if (order.orderStatus <= 0) {
    //   await getOrders()
    //   this.setState({ loading: false })
    //   onBack()
    // }
    // else {
    //   this.setState({ loading: false })
    // }
    this.setState({ loading: false })
  }

  onRefresh = () => {
    const { getOrderDetail, id, token, onBack, getOrders } = this.props
    this.setState({
      refreshing: true,
      loading: true
    }, async () => {
      await getOrderDetail(id, token)
      // const { order } = this.props
      // if (order.orderStatus <= 0) {
      //   await getOrders()
      //   this.setState({
      //     refreshing: false,
      //     loading: false
      //   })
      //   onBack()
      // }
      // else {
      //   this.setState({
      //     refreshing: false,
      //     loading: false
      //   })
      // }
      this.setState({
        refreshing: false,
        loading: false
      })
    })
  }

  onChangeShippingStatus = (status) => {
    this.setState({ shippingStatus: Number(status) })
  }

  onChangePaymentStatus = (status) => {
    this.setState({ paymentStatus: Number(status) })
  }

  onImageUpload = (image) => {
    const images = [...this.state.images, image]
    this.setState({ images })
  }

  updateProof = async (id) => {
    const { updateOrder, token, onBack, getOrders } = this.props
    const { images } = this.state
    if (images.length === 0) {
      return false
    }
    else {
      this.setState({ loading: true })
      mapSeries(images, (item, cb) => {
        const paymentId = item.paymentId
        if (item.id) {
          cb(null, item)
        }
        else {
          uploadProofImage(
            paymentId,
            item.fileName,
            item.resized
              ? item.resized.uri
              : item.fileUri
          )
            .then(response => {
              const image = {
                url: response.ref,
                fullUrl: response.downloadURL,
                size: response.totalBytes,
                shoppingCartPaymentId: paymentId,
                createdAt: moment().format()
              }
              cb(null, image)
            })
            .catch(err => {
              cb(err)
            })
        }
      }, async (err, results) => {
        if (err) {
          this.setState({ loading: false })
        }
        else {
          const data = {
            images: results,
            paymentStatus: PAYMENT_STATUS.SUBMITTED
          }
          await updateOrder(id, data, token)
          await getOrders()
          this.setState({ loading: false })
          onBack()
        }
      })
    }
  }

  updateOrder = async (id) => {
    const { updateOrder, token, onBack, getOrders } = this.props
    let data = { ...this.state }
    Alert.alert(
      'Confirm',
      'Do you want to update order?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
            if (data.shippingStatus == SHIPPING_STATUS.DELIVERIED && data.paymentStatus == PAYMENT_STATUS.PAID) {
              Alert.alert(
                'Confirm',
                'Do you want to complete order?',
                [
                  { text: 'Cancel', onPress: () => this.setState({ loading: false }) },
                  {
                    text: 'OK', onPress: async () => {
                      data.orderStatus = ORDER_STATUS.COMPLETE
                      await updateOrder(id, data, token)
                      await getOrders()
                      this.setState({ loading: false })
                      onBack()
                    }
                  }
                ],
                { cancelable: false }
              )
            }
            else if (data.shippingStatus == SHIPPING_STATUS.RETURN) {
              data.orderStatus = ORDER_STATUS.RETURN
              await updateOrder(id, data, token)
              await getOrders()
              this.setState({ loading: false })
              onBack()
            }
            else {
              await updateOrder(id, data, token)
              await getOrders()
              this.setState({ loading: false })
              onBack()
            }
          }
        }
      ],
      { cancelable: false }
    )
  }

  completeOrder = (id) => {
    const { completeOrder, token, onBack, getOrders } = this.props
    Alert.alert(
      'Confirm',
      'Do you want to complete order?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
            const data = {
              shippingStatus: SHIPPING_STATUS.DELIVERIED,
              paymentStatus: PAYMENT_STATUS.PAID,
              orderStatus: ORDER_STATUS.COMPLETE
            }
            await completeOrder(id, data, token)
            await getOrders()
            this.setState({ loading: false })
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  deleteOrder = (id) => {
    const { deleteOrder, token, getOrders, onBack, isUser, order } = this.props
    Alert.alert(
      'Confirm',
      'Do you want to delete order?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
            const data = {}
            if (isUser) {
              if (order.orderStatus === ORDER_STATUS.CANCEL_ON_REQUEST_BY_SHOP) {
                data.orderStatus = ORDER_STATUS.CANCEL_BY_SHOP
              }
              else if (order.orderStatus === ORDER_STATUS.COMPLETE) {
                return false
              }
              else if (
                order.shippingStatus === SHIPPING_STATUS.PACKING &&
                order.paymentStatus === PAYMENT_STATUS.TO_BE_CONFIRMED
              ) {
                data.orderStatus = ORDER_STATUS.CANCEL_BY_BUYER
              }
              else if (
                [SHIPPING_STATUS.SHIPPED, SHIPPING_STATUS.DELIVERIED, SHIPPING_STATUS.RETURN].includes(order.shippingStatus) ||
                [PAYMENT_STATUS.PAID, PAYMENT_STATUS.SUBMITTED].includes(order.paymentStatus)
              ) {
                data.orderStatus = ORDER_STATUS.CANCEL_ON_REQUEST_BY_BUYER
              }
            }
            else {
              if (order.orderStatus === ORDER_STATUS.CANCEL_ON_REQUEST_BY_BUYER) {
                data.orderStatus = ORDER_STATUS.CANCEL_BY_BUYER
              }
              else if (order.orderStatus === ORDER_STATUS.COMPLETE) {
                data.orderStatus = ORDER_STATUS.CANCEL_ON_REQUEST_BY_SHOP
              }
              else if (order.paymentStatus === PAYMENT_STATUS.PAID) {
                data.orderStatus = ORDER_STATUS.CANCEL_ON_REQUEST_BY_SHOP
              }
              else if (order.paymentStatus === PAYMENT_STATUS.TO_BE_CONFIRMED) {
                data.orderStatus = ORDER_STATUS.CANCEL_BY_SHOP
              }
            }
            // console.log(data);
            await deleteOrder(id, token, data)
            await getOrders()
            this.setState({ loading: false })
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  renderStatus = (status) => {
    const icon = {
    }
    switch (status) {
      case ORDER_STATUS.IN_PROGRESS:
        icon.name = 'access-time'
        icon.color = 'blue'
        break
      case ORDER_STATUS.COMPLETE:
        icon.name = 'check-circle'
        icon.color = 'green'
        break
      case ORDER_STATUS.RETURN:
        icon.name = 'assignment-return'
        break
      case ORDER_STATUS.DELETED:
        icon.name = 'x-circle'
        icon.type = 'foundation'
        break
      default:
        icon.name = 'x-circle'
        icon.type = 'foundation'
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
        {`${ORDER_STATUS_MAP[status]}`}
      </FormLabel>
    ]
  }

  removeProof = (item) => {
    const { images } = this.state
    const { deleteProof } = this.props
    const id = item.id
    const shoppingCartPaymentId = item.shoppingCartPaymentId
    this.setState({ images: [...images, item] })
    try {
      deleteProof(id, shoppingCartPaymentId)
    }
    catch (error) {
      this.setState({ images })
    }
  }

  removeImage = (item) => {
    const images = [...this.state.images]
    const index = images.findIndex(elem => elem.paymentId === item.paymentId && elem.fileUri === item.fileUri)
    const newImages = images.filter((elem, i) => i !== index)
    this.setState({ images: newImages })
  }

  render() {
    const { order, isUser, onBack } = this.props
    const { images, loading, refreshing } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Order detail'
            onBack={onBack} />
        </View>

        {!loading &&
          <View style={{ flex: 1 }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  title='Loading...'
                />
              }
            >
              <General
                isUser={isUser}
                id={order.id}
                date={order.orderCreatedAt}
                status={order.orderStatus}
                payments={order.shoppingCartPayments}
                user={order.user}
                shop={order.shop}
                cover={isUser
                  ? order.shop.images && order.shop.images.find(item => item.type === 1)
                  : order.user.images && order.user.images.length > 0 && order.user.images[0]
                }
                shippingStatus={order.shippingStatus}
                paymentStatus={order.paymentStatus}
                onChangePaymentStatus={this.onChangePaymentStatus}
                onChangeShippingStatus={this.onChangeShippingStatus}
                statusComponent={this.renderStatus(order.orderStatus)}
                onImageUpload={this.onImageUpload}
                images={images}
                completeOrder={() => this.completeOrder(order.id)}
                removeProof={this.removeProof}
                removeImage={this.removeImage}
              />

              <Details
                details={order.shoppingCartDetails}
                subTotalAmount={order.subTotalAmount}
                totalItem={order.totalItem}
              />

              {order.cartAdditionalFees && order.cartAdditionalFees.length > 0 &&
                <AdditionalFees fees={order.cartAdditionalFees} />
              }

              <View
                style={{
                  width: '100%',
                  backgroundColor: '#EFF1F4',
                  borderColor: '#989999',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  padding: 10,
                  paddingLeft: 20
                }}
              >
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', color: '#1A86E0' }}>
                  Total
                </Text>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', color: '#E55554', textAlign: 'right' }}>
                  {order.totalAmount}
                </Text>
              </View>

              <PaymentMethods payments={order.shoppingCartPayments} />

              <Delivery delivery={order.shopShippingType} />

              <ShippingInfo
                user={order.user}
                address={order.address}
              />

              <UserNote note={order.buyerNote || 'No note'} />

              <ShopNote note={order.shopNote || 'No note'} />

              {/* {!isUser && <View style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7, height: 80 }}>
                <View style={{ alignItems: 'flex-start' }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#b2bec3', width: width / 2, padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                    onPress={onBack}>
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#992320', width: width / 2, padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                    onPress={() => this.updateOrder(order.id)}>
                    <Text style={{ color: '#fff' }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>}

              {isUser && <View style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7, height: 80 }}>
                <View style={{ alignItems: 'flex-start' }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#b2bec3', width: width / 2, padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                    onPress={() => this.deleteOrder(order.id)}>
                    <Text style={{ color: '#fff' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#992320', width: width / 2, padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                    onPress={() => this.updateProof(order.id)}>
                    <Text style={{ color: '#fff' }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>} */}
            </ScrollView>
            <SubMenu
              deleteOrder={[ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCEL_BY_BUYER, ORDER_STATUS.CANCEL_BY_SHOP].includes(order.orderStatus) ? null : () => this.deleteOrder(order.id)}
              updateOrder={order.orderStatus >= 0 && order.orderStatus !== ORDER_STATUS.COMPLETE
                ? isUser
                  ? () => this.updateProof(order.id)
                  : () => this.updateOrder(order.id)
                : null}
              id={isUser ? order.shop.userId : order.user.id}
            />
          </View>
        }
        {
          loading && <View style={{
            justifyContent: 'center',
            padding: 10,
            alignItems: 'center',
            alignContent: 'center',
            height: '100%',
            flex: 1
          }}>
            <ActivityIndicator size="large" color="#6F4E37" />
          </View>
        }
      </DefaultPage>
    )
  }
}

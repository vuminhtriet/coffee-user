import React, { Component, PureComponent } from 'react'
import {
  FlatList,
  Text,
  View
} from 'react-native'
import { Card, Button } from 'react-native-elements'
import {
  ORDER_STATUS,
  ORDER_STATUS_MAP,
  SHIPPING_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  PAYMENT_STATUS
} from '../../../common/models'
import moment from 'moment'

class OrderItem extends PureComponent {
  render() {
    const {
      id,
      title,
      isUser,
      shopName,
      displayName,
      totalAmount,
      totalItem,
      orderStatus,
      itemWidth,
      orderCreatedAt,
      shippingStatus,
      paymentStatus,
      status,
      itemPress
    } = this.props
    return (
      <Card
        containerStyle={{ width: itemWidth, margin: 5 }}
      >
        <View
          style={{
            position: 'absolute',
            zIndex: 999,
            right: -10,
            top: 0,
            width: 140,
            height: 60
          }}
        >
          <Button
            backgroundColor='green'
            onPress={() => itemPress(id)}
            buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
            title='View'
          />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={{
              marginBottom: 0,
              textAlign: 'left',
              fontWeight: 'bold',
              paddingRight: 120,
              paddingBottom: 5
            }}
          >
            {`${title}`}
          </Text>
          <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            {`OrderID: ${id ? id : 'N/A'}`}
          </Text>
          <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            {`Date: ${moment(orderCreatedAt).format('LLL')}`}
          </Text>
          {(isUser) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            Sold by:
            <Text style={{ color: '#67B6F4' }}>
              {` ${shopName || ''}`}
            </Text>
          </Text>}
          {(!isUser) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            Customer:
            <Text style={{ color: '#67B6F4' }}>
              {` ${displayName || ''}`}
            </Text>
          </Text>}
          <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            {`Total amount: ${totalAmount} (${totalItem} items)`}
          </Text>
          <Text style={{
            marginLeft: 5,
            textAlign: 'left',
            paddingBottom: 5,
            color: status === ORDER_STATUS.IN_PROGRESS
              ? 'red'
              : status === ORDER_STATUS.COMPLETE
                ? 'green' : undefined
          }}>
            <Text style={{ marginBottom: 0, textAlign: 'left', fontWeight: 'bold', color: '#000' }}>
              Status:
            </Text>
            {` ${orderStatus}`}
            <Text style={{ color: '#000' }}>
              {` (${shippingStatus}, ${paymentStatus})`}
            </Text>
          </Text>
        </View>
      </Card>
    )
  }
}

export default class OrderList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  onRefresh = () => {
    const { onRefresh } = this.props
    onRefresh && onRefresh()
  }

  onLoadMore = () => {

  }

  _keyExtractor = (item, index) => item.id;

  renderItem = ({ item }) => {
    const { itemPress, isUser } = this.props
    const { itemWidth } = this.state
    const id = item.id
    const orderStatus = ORDER_STATUS_MAP[item.orderStatus]
    const shippingStatus = SHIPPING_STATUS_MAP[item.shippingStatus]
    // const paymentStatus = item.paymentStatus !== PAYMENT_STATUS.TO_BE_CONFIRMED
    //   ? PAYMENT_STATUS_MAP[item.paymentStatus]
    //   : isUser
    //     ? 'Waiting for payment proof'
    //     : PAYMENT_STATUS_MAP[item.paymentStatus]
    const paymentStatus = !isUser
      ? PAYMENT_STATUS_MAP[item.paymentStatus]
      : item.paymentStatus === PAYMENT_STATUS.TO_BE_CONFIRMED
        ? 'Waiting for payment proof'
        : item.paymentStatus === PAYMENT_STATUS.PAID
          ? 'Valid'
          : PAYMENT_STATUS_MAP[item.paymentStatus]
    const shopName = item.shop && item.shop.name
    const displayName = item.user && item.user.displayName
    return (
      // <Card
      //   containerStyle={{ width: itemWidth, margin: 5 }}
      // >
      //   <View
      //     style={{
      //       position: 'absolute',
      //       zIndex: 999,
      //       right: -10,
      //       top: 0,
      //       width: 140,
      //       height: 60
      //     }}
      //   >
      //     <Button
      //       backgroundColor='green'
      //       onPress={() => itemPress(id)}
      //       buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
      //       // icon={{ name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 } }}
      //       title='View'
      //     />
      //   </View>
      //   <View style={{ flexDirection: 'column' }}>
      //     <Text
      //       style={{
      //         marginBottom: 0,
      //         textAlign: 'left',
      //         fontWeight: 'bold',
      //         paddingRight: 120,
      //         paddingBottom: 5
      //       }}
      //     >
      //       {`${item.title}`}
      //     </Text>
      //     <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       {`OrderID: ${item.id ? item.id : 'N/A'}`}
      //     </Text>
      //     <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       {`Date: ${moment(item.orderCreatedAt).format('LLL')}`}
      //     </Text>
      //     {(isUser && item.shop) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       Sold by:
      //       <Text style={{ color: '#67B6F4' }}>
      //         {` ${item.shop.name || ''}`}
      //       </Text>
      //     </Text>}
      //     {(!isUser && item.user) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       Customer:
      //       <Text style={{ color: '#67B6F4' }}>
      //         {` ${item.user.displayName || ''}`}
      //       </Text>
      //     </Text>}
      //     <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       {`Total amount: ${item.totalAmount} (${item.totalItem} items)`}
      //     </Text>
      //     <Text style={{
      //       marginLeft: 5,
      //       textAlign: 'left',
      //       paddingBottom: 5,
      //       color: item.orderStatus === ORDER_STATUS.IN_PROGRESS
      //         ? 'red'
      //         : item.orderStatus === ORDER_STATUS.COMPLETE
      //           ? 'green' : undefined
      //     }}>
      //       <Text style={{ marginBottom: 0, textAlign: 'left', fontWeight: 'bold', color: '#000' }}>
      //         Status:
      //       </Text>
      //       {` ${orderStatus}`}
      //       <Text style={{ color: '#000' }}>
      //         {` (${shippingStatus}, ${paymentStatus})`}
      //       </Text>
      //     </Text>
      //   </View>
      // </Card >

      <OrderItem
        id={item.id}
        title={item.title}
        isUser={isUser}
        shopName={shopName}
        displayName={displayName}
        totalAmount={item.totalAmount}
        totalItem={item.totalItem}
        orderStatus={orderStatus}
        itemWidth={itemWidth}
        orderCreatedAt={item.orderCreatedAt}
        shippingStatus={shippingStatus}
        paymentStatus={paymentStatus}
        status={item.orderStatus}
        itemPress={itemPress}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const { data } = this.props
    return (
      <FlatList
        data={data}
        refreshing={refreshing}
        extraData={data}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        onEndReached={this.onLoadMore}
        onEndReachedThreshold={1}
        removeClippedSubviews
      />
    )
  }
}

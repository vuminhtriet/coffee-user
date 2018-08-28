import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View
} from 'react-native'
import { Card, Button } from 'react-native-elements'
import {
  CART_STATUS,
  CART_STATUS_MAP,
  PAYMENT_TYPE
} from '../../../common/models'
import moment from 'moment'

export default class CartList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  onRefresh () {
    const { onRefresh } = this.props
    onRefresh && onRefresh()
  }

  onLoadMore () {
  }

  _keyExtractor = (item, index) => item.id;

  renderItem ({ item }) {
    const { itemPress, isUser } = this.props
    const { itemWidth } = this.state
    const status = item.status ===
      CART_STATUS.TO_BE_CONFIRMED &&
      item.shoppingCartPayments &&
      item.shoppingCartPayments.length === 1 &&
      item.shoppingCartPayments[0].paymentType.renderType === PAYMENT_TYPE.COD
      ? 'COD'
      : item.status === CART_STATUS.TO_BE_CONFIRMED
        ? CART_STATUS_MAP[item.status]
        : 'Waiting for customer to checkout'
    return (
      <Card
        containerStyle={{ width: itemWidth, margin: 5 }}
      >
        <View
          style={{
            position: 'absolute',
            right: -10,
            top: 0,
            zIndex: 999,
            width: 130,
            height: 60
          }}
        >
          {item.status === CART_STATUS.TO_BE_CONFIRMED
            ? <Button
              backgroundColor='#E64B47'
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              icon={{ name: 'check', buttonStyle: { marginLeft: 0 } }}
              title='Confirm'
              onPress={() => itemPress(item.id, true)}
            />
            : <Button
              backgroundColor='green'
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              // icon={{ name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 } }}
              title='View'
              onPress={() => itemPress(item.id)}
            />
          }
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
            {`${item.title}`}
          </Text>
          <Text style={{
            marginLeft: 5,
            textAlign: 'left',
            paddingBottom: 5
          }}>
            {`CartID: ${item.id ? item.id : 'N/A'}`}
          </Text>
          {(isUser && item.shop) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            Sold by:
            <Text style={{ color: '#67B6F4' }}>
              {` ${item.shop.name || ''}`}
            </Text>
          </Text>}
          {(!isUser && item.user) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            Customer:
            <Text style={{ color: '#67B6F4' }}>
              {` ${item.user.displayName || ''}`}
            </Text>
          </Text>}
          <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            {`Last updated: ${moment(item.createdAt).format('MMM DD, YYYY')}`}
          </Text>
          <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            {`Total amount: ${item.totalAmount} (${item.totalItem} items)`}
          </Text>
          <Text
            style={{
              marginLeft: 5,
              textAlign: 'left',
              paddingBottom: 5,
              color: item.status === CART_STATUS.TO_BE_CONFIRMED || status === 'COD'
                ? 'red'
                : [CART_STATUS.READY_TO_CHECKOUT, CART_STATUS.WAITING_FOR_PAYMENT_PROOF].includes(item.status)
                  ? 'green' : undefined
            }}>
            <Text
              style={{ marginBottom: 0, textAlign: 'left', fontWeight: 'bold', color: '#000' }}>
              Status:
            </Text>
            {` ${status} `}
          </Text>
        </View>
      </Card>
    )
  }

  render () {
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
      />
    )
  }
}

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

export default class UserCartList extends Component {
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

  renderItem ({ index, item }) {
    const { itemPress } = this.props
    const { itemWidth } = this.state
    const status = item.status ===
      CART_STATUS.TO_BE_CONFIRMED &&
      item.shoppingCartPayments &&
      item.shoppingCartPayments.length === 1 &&
      item.shoppingCartPayments[0].paymentType.renderType === PAYMENT_TYPE.COD
      ? 'COD'
      : CART_STATUS_MAP[item.status]
    return (
      <Card
        containerStyle={{ width: itemWidth, margin: 5 }}
        key={index}
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
          {[CART_STATUS.SHOPPING, CART_STATUS.READY_TO_CHECKOUT, CART_STATUS.WAITING_FOR_PAYMENT_PROOF].includes(item.status)
            ? <Button
              backgroundColor={item.status === CART_STATUS.SHOPPING ? '#67B6F4' : '#E64B47'}
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              icon={{ name: item.status === CART_STATUS.SHOPPING ? 'play-arrow' : 'check', buttonStyle: { marginLeft: 0 } }}
              title={item.status === CART_STATUS.SHOPPING ? 'Proceed' : 'Checkout'}
              onPress={() => itemPress(item)}
            />
            : <Button
              backgroundColor='green'
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              // icon={{ name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 } }}
              title='View'
              onPress={() => itemPress(item)}
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
          {item.shop && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            Sold by:
            <Text style={{ color: '#67B6F4' }}>
              {` ${item.shop.name || ''}`}
            </Text>
          </Text>}
          <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
            {`Last updated: ${moment(item.updatedAt).format('LLL')}`}
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
                ? 'green'
                : [CART_STATUS.READY_TO_CHECKOUT, CART_STATUS.WAITING_FOR_PAYMENT_PROOF].includes(item.status)
                  ? 'red' : '#67B6F4'
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

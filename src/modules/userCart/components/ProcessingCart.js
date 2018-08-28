import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Modal,
  Dimensions
} from 'react-native'
import { Card, Button } from 'react-native-elements'
import UserCartDetail from '../containers/UserCartDetail'
import { CART_STATUS } from '../../order/models'
import { getTotalAmount } from '../utils'
import moment from 'moment'
const { height } = Dimensions.get('window')

export default class ProcessingCart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      showDetail: false,
      cart: null
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.itemPress = this.itemPress.bind(this)
    this.onBack = this.onBack.bind(this)
  }

  onRefresh () {
  }

  onLoadMore () {
  }

  keyExtractor (item, index) {
    return index
  }

  itemPress (item, confirm = false) {
    const { userId } = this.props
    userId && this.setState({
      showDetail: true,
      cart: item,
      confirm
    })
  }

  onBack () {
    this.setState({
      showDetail: false,
      cart: null
    })
  }

  renderItem ({ index, item: { item } }) {
    const { cartPage, currencyUnits } = this.props
    const { itemWidth } = this.state

    return (
      <Card
        key={index}
        containerStyle={{ width: itemWidth, margin: 5 }}
      >
        <View
          style={{
            position: 'absolute',
            right: -10,
            top: 0,
            zIndex: 999,
            width: 140,
            height: 60}}
        >
          {(item.metaData.status === 1 || item.metaData.status === 2)
            ? <Button
              backgroundColor='green'
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              icon={{name: 'check', buttonStyle: { marginLeft: 0 }}}
              title={item.metaData.status === 1 ? 'Confirm' : 'Checkout'}
              onPress={() => this.itemPress(item)}
            />
            : <Button
              backgroundColor='green'
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              icon={{name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 }}}
              title='Detail'
              onPress={() => this.itemPress(item)}
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
            {`${item.metaData.title}`}
          </Text>
          <Text style={{
            marginLeft: 5,
            textAlign: 'left',
            paddingBottom: 5
          }}>
            {`CartID: ${item.id ? item.id : 'N/A'}`}
          </Text>
          {(cartPage && item.shop) && <Text style={{marginLeft: 5, textAlign: 'left', paddingBottom: 5}}>
            Sold by
            <Text style={{ color: '#67B6F4' }}>
              {` ${item.shop.name || ''}`}
            </Text>
          </Text>}
          <Text style={{marginLeft: 5, textAlign: 'left', paddingBottom: 5}}>
            {`Last updated: ${moment(item.metaData.updatedAt).format('MMM DD, YYYY')}`}
          </Text>
          <Text style={{marginLeft: 5, textAlign: 'left', paddingBottom: 5}}>
            {`Total amount: ${getTotalAmount(item.amounts, currencyUnits)} (${item.metaData.totalQuantity} items)`}
          </Text>
          {
            (!cartPage && item.user) && <Text style={{marginLeft: 5, textAlign: 'left', paddingBottom: 5}}>
              {`Customer: ${item.user.name}`}
            </Text>
          }
          <Text
            style={{
              marginLeft: 5,
              textAlign: 'left',
              paddingBottom: 5,
              color: item.metaData.status === 1
                ? 'red'
                : [2, 4].includes(item.metaData.status)
                  ? 'green' : undefined
            }}>
            <Text
              style={{marginBottom: 0, textAlign: 'left', fontWeight: 'bold', color: '#000'}}>
              Status:
            </Text>
            {` ${CART_STATUS[item.metaData.status]} `}
          </Text>
        </View>
      </Card>
    )
  }

  render () {
    const { carts, getCheckedOutCarts, userId, token, currencyUnits } = this.props
    const { refreshing, showDetail, cart } = this.state

    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          backgroundColor: '#ffffff'
        }}>
        <FlatList
          data={carts}
          refreshing={refreshing}
          keyExtractor={this.keyExtractor}
          renderItem={(item, index) => this.renderItem({item, index})}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={showDetail && cart !== null}
        >
          <View style={{ width: '100%', height }}>
            <UserCartDetail
              currencyUnits={currencyUnits}
              userCart
              cart={cart}
              onBack={this.onBack}
              getCheckedOutCarts={() => getCheckedOutCarts(userId, token)} />
          </View>
        </Modal>
      </View>)
  }
}

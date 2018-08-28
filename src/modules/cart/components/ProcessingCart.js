import React, { Component, PureComponent } from 'react'
import {
  View,
  Modal
} from 'react-native'
import UserCartDetail from '../containers/UserCartDetail'
import ShoppingCartDetail from '../containers/ShoppingCartDetail'
import { CART_STATUS } from '../../../common/models'
import UserCartList from './UserCartList'

export default class ProcessingCart extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      showDetail: false,
      item: null
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.itemPress = this.itemPress.bind(this)
    this.onBack = this.onBack.bind(this)
  }

  onRefresh () {
    const { getUserCarts, id, token } = this.props
    id && token && getUserCarts(id, token)
  }

  itemPress (item) {
    this.setState({
      showDetail: true,
      item
    })
  }

  onBack () {
    this.setState({
      showDetail: false,
      item: null
    })
  }

  componentDidMount () {
    const { getUserCarts, id, token } = this.props
    id && token && getUserCarts(id, token)
  }

  getUserCarts = () => {
    const { getUserCarts, id, token } = this.props
    getUserCarts(id, token)
  }

  render () {
    const { carts } = this.props
    const { refreshing, showDetail, item } = this.state
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          backgroundColor: '#ffffff'
        }}>
        <UserCartList
          itemPress={this.itemPress}
          data={carts}
          onRefresh={this.onRefresh}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={showDetail && item !== null}
        >
          {item && <View style={{ width: '100%', flex: 1 }}>
            {item.status !== CART_STATUS.SHOPPING
              ? <UserCartDetail
                id={item.id}
                onBack={this.onBack}
                getCarts={this.getUserCarts} />
              : <ShoppingCartDetail
                id={item.id}
                onBack={this.onBack}
                getCarts={this.getUserCarts} />
            }
          </View>}
        </Modal>
      </View>)
  }
}

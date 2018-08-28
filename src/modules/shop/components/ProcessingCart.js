import React, { Component, PureComponent } from 'react'
import {
  View,
  Modal
} from 'react-native'
import ShopCartDetail from '../../cart/containers/ShopCartDetail'
import CartList from './CartList';

export default class ProcessingCart extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showDetail: false,
      id: null
    }
  }

  onRefresh = () => {
    const { getShopCarts, token, id } = this.props
    id && token && getShopCarts(token, id)
  }

  itemPress = (id, confirm = false) => {
    this.setState({
      showDetail: true,
      id: id
    })
  }

  onBack = () => {
    this.setState({
      showDetail: false,
      id: null
    })
  }

  componentDidMount() {
    const { getShopCarts, token, id } = this.props
    id && token && getShopCarts(token, id)
  }

  getShopCarts = () => {
    const { id, token, getShopCarts } = this.props
    getShopCarts(token, id)  
  }

  render() {
    const { carts, isUser } = this.props
    const { showDetail, id } = this.state
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff'
        }}>
        <CartList
          isUser={isUser}
          itemPress={this.itemPress}
          data={carts}
          onRefresh={this.onRefresh}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={showDetail && id !== null}
        >
          <View style={{ width: '100%', flex: 1 }}>
            <ShopCartDetail
              id={id}
              onBack={this.onBack}
              getCarts={this.getShopCarts} />
          </View>
        </Modal>
      </View>)
  }
}

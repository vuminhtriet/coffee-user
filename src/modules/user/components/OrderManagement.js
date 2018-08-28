import React, { Component } from 'react'
import {
  View,
  Modal,
  Dimensions
} from 'react-native'
import OrderList from '../../order/containers/OrderList'
import OrderDetail from '../../order/containers/OrderDetail'
const { height } = Dimensions.get('window')

export default class OrderManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showDetail: false,
      order: null
    }

    this.onBack = this.onBack.bind(this)
    this.itemPress = this.itemPress.bind(this)
  }

  onBack () {
    this.setState({
      showDetail: false,
      order: null
    })
  }

  itemPress (item, index) {
    this.setState({
      showDetail: true,
      order: item
    })
  }

  render () {
    const { orders } = this.props
    const { showDetail, order } = this.state
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff'
        }}>
        <OrderList
          itemPress={this.itemPress}
          data={orders}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={showDetail && order !== null}
        >
          <View style={{ width: '100%', flex: 1 }}>
            <OrderDetail order={order} onBack={this.onBack} />
          </View>
        </Modal>
      </View>)
  }
}

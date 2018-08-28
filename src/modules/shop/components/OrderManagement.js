import React, { Component, PureComponent } from 'react'
import {
  View,
  Modal,
  Dimensions
} from 'react-native'
import OrderList from '../containers/OrderList'
import OrderDetail from '../containers/OrderDetail';
const { height } = Dimensions.get('window')

export default class OrderManagement extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      id: null
    }
  }

  onRefresh = () => {
    const { getOrders, id, token } = this.props
    id && token && getOrders(id, token)
  }

  openModal = (id) => {
    this.setState({
      modalVisible: true,
      id: id
    })
  }

  closeModal = () => {
    this.setState({
      modalVisible: false,
      id: null
    })
  }

  componentDidMount() {
    const { getOrders, id, token } = this.props
    id && token && getOrders(id, token)
  }

  getOrders = () => {
    const { id, token, getOrders } = this.props
    getOrders(id, token)
  }

  render() {
    const { orders, isUser } = this.props
    const { modalVisible, id } = this.state
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff'
        }}>
        <OrderList
          isUser={isUser}
          itemPress={this.openModal}
          data={orders}
          onRefresh={this.onRefresh}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={modalVisible && id !== null}
        >
          <View style={{ width: '100%', flex: 1 }}>
            <OrderDetail
              id={id}
              onBack={this.closeModal}
              isUser={isUser}
              getOrders={this.getOrders} />
          </View>
        </Modal>
      </View>
    )
  }
}

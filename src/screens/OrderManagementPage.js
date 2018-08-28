import React, { Component } from 'react'
import {
  View,
  Modal
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import OrderManagement from '../modules/shop/containers/OrderManagement'
import SortList from '../modules/shop/components/SortList'

export default class OrderManagementPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openSort: false
    }
  }

  onSortType = () => {
    const { openSort } = this.state
    this.setState({
      openSort: !openSort
    })
  }

  render() {
    const { openSort } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            canBack={false} onBack={() => navigation.goBack()}
            onSort={this.onSortType}
            title={`Order management`}
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <OrderManagement navigation={navigation} isUser={false} />
        </View>
        <Modal
          animationType='slide'
          transparent={false}
          visible={openSort}
        >
          <SortList toggleSort={this.onSortType} />
        </Modal>
      </DefaultPage>
    )
  }
}

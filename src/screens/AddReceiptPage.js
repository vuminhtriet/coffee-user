import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import AddReceipt from '../modules/shop/containers/AddReceipt'

export default class AddReceiptPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addPayment: false
    }
    this.goBack = this.goBack.bind(this)
  }
  goBack () {
    const { navigation } = this.props
    navigation.goBack()
  }
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column', height: '100%' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle title='Thêm hóa đơn' onBack={this.goBack} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <AddReceipt navigation={navigation} />
        </View>
      </DefaultPage>
    )
  }
}

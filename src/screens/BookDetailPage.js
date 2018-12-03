import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BookDetail from '../modules/order/containers/BookDetail'

export default class ShopInformationPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      address: {}
    }
  }

  render () {
    const { address } = this.state
    const { navigation } = this.props
    const shop = navigation.getParam('shop', {})
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Đặt chỗ'
            onBack={() => navigation.goBack()} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <BookDetail
            navigation={navigation}
            shop={shop}
          />
        </View>
      </DefaultPage>
    )
  }
}

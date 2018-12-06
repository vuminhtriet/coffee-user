import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BookConfirm from '../modules/order/containers/BookConfirm'

export default class BookConfirmPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { navigation } = this.props
    const memberId = navigation.getParam('memberId', {})
    const shopId = navigation.getParam('shopId', {})
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
          <BookConfirm
            navigation={navigation}
            shopId={shopId}
            memberId={memberId}
          />
        </View>
      </DefaultPage>
    )
  }
}

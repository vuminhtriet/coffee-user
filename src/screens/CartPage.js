import React, { Component } from 'react'
import {
  View
} from 'react-native'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
// import ProcessingCart from '../modules/cart/containers/ProcessingCart'
export default class ProductsPage extends Component {
  render () {
    const { navigation } = this.props

    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ display: 'flex', width: '100%' }}>
          <HeaderTitle title='My shopping carts' />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          {/* <ProcessingCart
            navigation={navigation}
            cartPage
          /> */}
        </View>
      </DefaultPage>
    )
  }
}

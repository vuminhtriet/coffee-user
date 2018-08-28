import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchProduct'
import DefaultPage from '../common/hocs/defaultPage'
import PageFlashSaleProducts from '../modules/dashboard/containers/PageFlashSaleProducts'

export default class ProductsPage extends Component {
  render () {
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header />
        </View>
        <PageFlashSaleProducts />
      </DefaultPage>
    )
  }
}

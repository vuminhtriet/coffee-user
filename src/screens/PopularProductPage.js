import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchProduct'
import DefaultPage from '../common/hocs/defaultPage'
import PagePopularProducts from '../modules/dashboard/containers/PagePopularProducts'

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
        <PagePopularProducts />
      </DefaultPage>
    )
  }
}

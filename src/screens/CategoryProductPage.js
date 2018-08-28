import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchProduct'
import DefaultPage from '../common/hocs/defaultPage'
import PageCategoryProduct from '../modules/dashboard/containers/PageCategoryProduct'

export default class CategoryProductPage extends Component {
  render () {
    const { navigation } = this.props
    const categoryId = navigation.getParam('categoryId', 1)

    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header />
        </View>
        <PageCategoryProduct categoryId={categoryId} />
      </DefaultPage>
    )
  }
}

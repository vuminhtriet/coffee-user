import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PageCategoryProduct from '../modules/dashboard/containers/PageCategoryProduct'

export default class CategoryProductPage extends Component {
  
  constructor (props) {
    super(props)
  }
  
  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    const categoryId = navigation.getParam('categoryId', 1)
    const shopId = navigation.getParam('shopId', 1)
    const categoryName = navigation.getParam('categoryName', 'none')

    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header onBack={this.onBack} title={categoryName} />
        </View>
        <PageCategoryProduct categoryId={categoryId} shopId={shopId} />
      </DefaultPage>
    )
  }
}

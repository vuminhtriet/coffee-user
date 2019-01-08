import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PageBrands from '../modules/dashboard/containers/PageBrands'

export default class BrandPage extends Component {

  constructor (props) {
    super(props)
  }
  
  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ display: 'flex', width: '100%' }}>
          <Header onBack={this.onBack} title='Tất cả thương hiệu' />
        </View>
        <PageBrands />
      </DefaultPage>
    )
  }
}

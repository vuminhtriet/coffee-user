import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PageBrandShops from '../modules/dashboard/containers/PageBrandShops'

export default class ShopsPage extends Component {

  constructor (props) {
    super(props)
  }
  
  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    const brandId = navigation.getParam('id', '')
    const brandName = navigation.getParam('name', 'none')

    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ display: 'flex', width: '100%' }}>
          <Header onBack={this.onBack} title={brandName} />
        </View>
        <PageBrandShops brandId={brandId}/>
      </DefaultPage>
    )
  }
}

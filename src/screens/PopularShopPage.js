import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PagePopularShops from '../modules/dashboard/containers/PagePopularShops'

export default class ShopsPage extends Component {

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
          <Header onBack={this.onBack} title='Thương hiệu phổ biến' />
        </View>
        <PagePopularShops/>
      </DefaultPage>
    )
  }
}

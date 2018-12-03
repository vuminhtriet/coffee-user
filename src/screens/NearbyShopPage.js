import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PageNearbyShops from '../modules/dashboard/containers/PageNearbyShops'

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
          <Header onBack={this.onBack} title='Thương hiệu gần bạn' />
        </View>
        <PageNearbyShops/>
      </DefaultPage>
    )
  }
}

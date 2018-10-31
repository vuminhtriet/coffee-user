import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ShopInformation from '../modules/shop/containers/ShopInformation'

export default class ShopInformationPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shop: {},
      address: {}
    }
  }

  render () {
    const { shop, address } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Thông tin quán'
            onBack={() => navigation.goBack()} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <ShopInformation
            navigation={navigation}
          />
        </View>
      </DefaultPage>
    )
  }
}

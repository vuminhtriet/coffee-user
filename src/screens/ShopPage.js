import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ShopSetting from '../modules/shop/containers/ShopSetting'

export default class ShopPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', zIndex: 999 }}>
          <HeaderTitle canBack={false} title={`My shop`} />
        </View>
        <View style={{ width: '100%', flex: 1, zIndex: 1 }}>
          <ShopSetting navigation={navigation} />
        </View>
      </DefaultPage>
    )
  }
}

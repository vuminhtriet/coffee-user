import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { SCREENS } from '../common/screens'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BorderButton from '../common/components/elements/BorderButton'
import DetailPointManagement from '../modules/shop/containers/DetailPointManagement'

export default class ShopDetailPointListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addPayment: false
    }
    this.goBack = this.goBack.bind(this)
  }

  goBack() {
    const { navigation } = this.props
    navigation.goBack()
  }

  render() {
    const { navigation } = this.props
    const userPoint = navigation.getParam('userPoint', {})

    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column', height: '100%' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title={userPoint.member && userPoint.member.displayName || 'none'}
            onBack={this.goBack}
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <DetailPointManagement userPoint={userPoint} />
          </View>
        </View>
      </DefaultPage>
    )
  }
}

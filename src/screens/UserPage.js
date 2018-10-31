import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import UserSetting from '../modules/user/containers/UserSetting'

export default class UserPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle title='Tài khoản của tôi' />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <UserSetting navigation={navigation} />
        </View>
      </DefaultPage>
    )
  }
}

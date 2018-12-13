import React, { Component } from 'react'
import {
  View
  // Modal
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ModalWrapper from '../common/components/elements/Modal'
import UserQR from '../modules/user/containers/UserQR'
import PaymentMethod from '../modules/user/containers/PaymentMethod'

export default class UserQrPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      back: false,
      addPayment: false
    }
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Mã QR của bạn'
            onBack={() => navigation.goBack()} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <UserQR navigation={navigation} />
        </View>
      </DefaultPage>
    )
  }
}

import React, { Component } from 'react'
import {
  View
  // Modal
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ModalWrapper from '../common/components/elements/Modal'
import UserInformation from '../modules/user/containers/UserInformation'
import PaymentMethod from '../modules/user/containers/PaymentMethod'

export default class UserInformationPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      back: false,
      addPayment: false
    }
    this.togglePayment = this.togglePayment.bind(this)
  }
  togglePayment () {
    const { addPayment } = this.state
    this.setState({
      addPayment: !addPayment
    })
  }
  render () {
    const { addPayment } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Thông tin chung'
            onBack={() => navigation.goBack()} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <UserInformation togglePayment={this.togglePayment} navigation={navigation} />
        </View>
        <ModalWrapper
          animationType='slide'
          transparent={false}
          visible={addPayment}
        >
          <PaymentMethod togglePayment={this.togglePayment} />
        </ModalWrapper>
      </DefaultPage>
    )
  }
}

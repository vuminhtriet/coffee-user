import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import UserPaymentMethod from '../modules/user/containers/UserPaymentMethod'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ModalWrapper from '../common/components/elements/Modal'
import PaymentMethod from '../modules/user/containers/PaymentMethod'

export default class UserPaymentMethodPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addPayment: false
    }
    this.goBack = this.goBack.bind(this)
    this.togglePayment = this.togglePayment.bind(this)
  }

  goBack () {
    const { navigation } = this.props
    navigation.goBack()
  }

  togglePayment () {
    const { addPayment } = this.state
    this.setState({
      addPayment: !addPayment
    })
  }

  render () {
    const { navigation } = this.props
    const { addPayment } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='User payment methods'
            onBack={this.goBack}
            rightIcon={
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  zIndex: 1,
                  height: 30,
                  borderColor: '#FFFFFF',
                  justifyContent: 'center'
                }}
                onPress={this.togglePayment}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>+ Add</Text>
              </TouchableOpacity>
            }
          />
        </View>
        {/* <UserPaymentMethod navigation={navigation} />
        <ModalWrapper
          animationType='slide'
          transparent={false}
          visible={addPayment}
        >
          <PaymentMethod togglePayment={this.togglePayment} />
        </ModalWrapper> */}
      </DefaultPage>
    )
  }
}

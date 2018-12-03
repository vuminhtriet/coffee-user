import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import ShopPaymentMethod from '../modules/shop/containers/ShopPaymentMethod'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ModalWrapper from '../common/components/elements/Modal'
import PaymentMethod from '../modules/shop/containers/PaymentMethod'

export default class ShopPaymentMethodPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addPayment: false
    }
  }

  goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  togglePayment = () => {
    const { addPayment } = this.state
    this.setState({
      addPayment: !addPayment
    })
  }

  render() {
    const { navigation } = this.props
    const { addPayment } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Phương thức thanh toán'
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
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>+ Thêm</Text>
              </TouchableOpacity>
            }
          />
        </View>
        <ShopPaymentMethod navigation={navigation} />
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

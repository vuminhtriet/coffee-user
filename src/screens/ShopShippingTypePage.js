import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import ShopShippingType from '../modules/shop/containers/ShopShippingType'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ModalWrapper from '../common/components/elements/Modal'
import DeliveryMethod from '../modules/shop/containers/DeliveryMethod'

export default class ShopShippingTypePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addShipping: false
    }
  }

  goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  toggleShipping = () => {
    const { addShipping } = this.state
    this.setState({
      addShipping: !addShipping
    })
  }

  render() {
    const { navigation } = this.props
    const { addShipping } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Phương thức giao hàng'
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
                onPress={this.toggleShipping}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>+ Thêm</Text>
              </TouchableOpacity>
            }
          />
        </View>
        {/* <ShopShippingType navigation={navigation} />
        <ModalWrapper
          animationType='slide'
          transparent={false}
          visible={addShipping}
        >
          <DeliveryMethod toggleShipping={this.toggleShipping} />
        </ModalWrapper> */}
      </DefaultPage>
    )
  }
}

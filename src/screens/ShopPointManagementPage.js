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
import PointManagement from '../modules/shop/containers/PointManagement'

export default class ShopPointManagementPage extends Component {
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

  _navigateAddReceipt = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.AddReceiptPage)
  }

  render() {
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column', height: '100%' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Quản lý tích điểm'
            onBack={this.goBack}
            rightIcon={
              // <BorderButton
              //   inStyle={{
              //     position: 'absolute',
              //     right: 5,
              //     zIndex: 1,
              //     height: 30,
              //     borderColor: '#FFFFFF'
              //   }}
              //   title='+ Add'
              //   onPress={() => navigation.navigate(SCREENS.AddProductPage)}
              // />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  zIndex: 1,
                  height: 30,
                  borderColor: '#FFFFFF',
                  justifyContent: 'center'
                }}
                onPress={this._navigateAddReceipt}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>+ Thêm</Text>
              </TouchableOpacity>
            }
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <PointManagement />
          </View>
        </View>
      </DefaultPage>
    )
  }
}

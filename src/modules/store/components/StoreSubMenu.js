import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import Ion from 'react-native-vector-icons/Ionicons'
import { SCREENS } from '../../../common/screens'
import call from 'react-native-phone-call'

export default class ProductSubMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  onPress = () => {
    const { navigation, token, onToggleWriteReview } = this.props
    token ? onToggleWriteReview : navigation.navigate(SCREENS.AuthenticatePage)
  }

  call = () => {
    const { shopInfo } = this.props
    const args = {
      number: shopInfo.shopPhoneNumber, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    }
    call(args).catch(console.error)
  }

  render() {
    const { shopInfo, token, onToggleWriteReview } = this.props

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 70,
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white',
          borderTopColor: '#EFEFF4',
          borderTopWidth: 2
        }}
      >
        <TouchableOpacity
          onPress={this.call}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <Ion
            name={'ios-call'}
            size={30}
            color='green'
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Gọi quán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
          onPress={token ? onToggleWriteReview : this.onPress}
        >
          <Ion
            name={'ios-chatboxes'}
            size={30}
            color='#FFB233'
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Đánh giá</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

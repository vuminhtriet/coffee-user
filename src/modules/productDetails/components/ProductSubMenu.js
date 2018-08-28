import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import Ion from 'react-native-vector-icons/Ionicons'
import { SCREENS } from '../../../common/screens'

export default class ProductSubMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  onChatWithShop = () => {
    const { navigation, shopInfo, token } = this.props

    if (!token) {
      navigation.navigate(SCREENS.AuthenticatePage)
    } else {
      navigation.navigate(SCREENS.ChatDetailPage, { userId: shopInfo.userId })
    }
  }
  render() {
    const { onToggleAddToCart } = this.props

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
          onPress={onToggleAddToCart}
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
            name={'md-add-circle'}
            size={30}
            color='red'
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Add to cart</Text>
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
          onPress={this.onChatWithShop}
        >
          <Ion
            name={'ios-chatboxes'}
            size={30}
            color='#9E9E9E'
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Chat now</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

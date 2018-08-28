import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import Ion from 'react-native-vector-icons/Ionicons'
import { Icon } from 'react-native-elements'
import { SCREENS } from '../../../common/screens'
import { CART_STATUS } from '../../../common/models';
import { withNavigation } from 'react-navigation';

class SubMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  onChatWithShop = () => {
    const { navigation, id, token, onBack } = this.props
    onBack && onBack()
    if (!token) {
      navigation.navigate({
        routeName: SCREENS.AuthenticatePage,
        key: SCREENS.AuthenticatePage
      })
    } else {
      navigation.navigate({ 
        routeName: SCREENS.ChatDetailPage,
        key: SCREENS.ChatDetailPage,
        params: { userId: id }
      })
    }
  }

  render() {
    const { deleteCart, updateCart, checkoutCart, status } = this.props

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 80,
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white',
          borderTopColor: '#EFEFF4',
          borderTopWidth: 2
        }}
      >
        <TouchableOpacity
          onPress={deleteCart}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
          disabled={deleteCart ? false : true}
        >
          <Ion
            name={'md-close-circle'}
            size={30}
            color={deleteCart ? 'red' : '#9E9E9E'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Remove</Text>
        </TouchableOpacity>
        {(updateCart || checkoutCart) && <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
          onPress={
            status === CART_STATUS.SHOPPING || status === CART_STATUS.TO_BE_CONFIRMED
              ? updateCart
              : checkoutCart
          }
          disabled={updateCart || checkoutCart ? false : true}
        >
          <Ion
            name={'md-checkmark-circle'}
            size={30}
            color={updateCart || checkoutCart ? 'green' : '#9E9E9E'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16, textAlign: 'center' }}>
            {
              status === CART_STATUS.SHOPPING
                ? 'Proceed to checkout'
                : status === CART_STATUS.TO_BE_CONFIRMED
                  ? 'Confirm'
                  : 'Checkout'
            }
          </Text>
        </TouchableOpacity>}
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
            color={'#6F4E37'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Chat now</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default withNavigation(SubMenu)
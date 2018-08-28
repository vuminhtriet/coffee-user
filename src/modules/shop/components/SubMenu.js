import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import Ion from 'react-native-vector-icons/Ionicons'
import { SCREENS } from '../../../common/screens'
import { withNavigation } from 'react-navigation';

class SubMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  onChatWithShop = () => {
    const { navigation, id, token } = this.props

    if (!token) {
      navigation.navigate(SCREENS.AuthenticatePage)
    } else {
      navigation.navigate(SCREENS.ChatDetailPage, { userId: id })
    }
  }

  render() {
    const { deleteOrder, updateOrder } = this.props

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
        {deleteOrder && <TouchableOpacity
          onPress={deleteOrder}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
          disabled={deleteOrder ? false : true}
        >
          <Ion
            name={'md-close-circle'}
            size={30}
            color={deleteOrder ? 'red' : '#9E9E9E'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Remove</Text>
        </TouchableOpacity>}
        {updateOrder && <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
          onPress={updateOrder}
          disabled={updateOrder ? false : true}
        >
          <Ion
            name={'md-checkmark-circle'}
            size={30}
            color={updateOrder ? 'green' : '#9E9E9E'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Update</Text>
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
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import Ion from 'react-native-vector-icons/Ionicons'
import { SCREENS } from '../../../common/screens'
import { withNavigation } from 'react-navigation';

class SubMenuFilter extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { resetFilter, applyFilter } = this.props

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
          onPress={resetFilter}
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
            name={'md-refresh-circle'}
            size={30}
            color={'red'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16 }}>Reset</Text>
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
          onPress={applyFilter}
        >
          <Ion
            name={'md-checkmark-circle'}
            size={30}
            color={'green'}
            containerStyle={{}}
          />
          <Text style={{ fontSize: 16, textAlign: 'center' }}>Apply</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default withNavigation(SubMenuFilter)
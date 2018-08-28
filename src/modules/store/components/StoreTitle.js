import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { Button } from 'react-native-elements'

export default class StoreTitle extends Component {
  render () {
    const { shop } = this.props
    if (!shop.description) {
      return null
    }
    return (
      <View style={{ paddingTop: 7, width: '100%', paddingLeft: 10, paddingRight: 10, backgroundColor: '#fff' }}>
        <Text style={{ lineHeight: 24 }}>
          {shop.description}
        </Text>
        {/* <View style={{ marginLeft: -15, paddingTop: 10, paddingBottom: 10 }}>
          <Button
            backgroundColor='white'
            color='red'
            borderRadius={5}
            onPress={() => {}}
            fontSize={18}
            containerViewStyle={{ width: 150 }}
            buttonStyle={{ padding: 5, borderColor: '#0984E3', borderWidth: 1 }}
            icon={{ name: 'keyboard-arrow-down', color: 'red', size: 20, buttonStyle: { marginLeft: 0 } }}
            title='View more'
          />
        </View> */}
      </View>
    )
  }
}

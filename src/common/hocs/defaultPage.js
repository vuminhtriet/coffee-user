import React, { PureComponent } from 'react'
import { View, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default class DefaultPage extends PureComponent {
  render () {
    const { children, styles } = this.props
    return (
      <View
        style={{
          flex: 1,
          ...Platform.select({
            ios: ifIphoneX({
              paddingTop: 32
            }, {
              paddingTop: 20
            }),
            android: {
              paddingTop: 0
            }
          }),
          ...styles
        }}
      >
        {children}
      </View>
    )
  }
}

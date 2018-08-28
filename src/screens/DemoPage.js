import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import DemoComponent from '../modules/demo/containers/DemoComponent'

export default class DemoPage extends Component {
  render () {
    return (
      <DefaultPage blocking={false}>
        <View>
          <Text> News HERE </Text>
        </View>
      </DefaultPage>
    )
  }
}

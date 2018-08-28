import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ChatHistory from '../modules/chat/containers/ChatHistory'

export default class ChatHistoryPage extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', flex: 1 }}>
          <ChatHistory navigation={navigation} />
        </View>
      </DefaultPage>
    )
  }
}

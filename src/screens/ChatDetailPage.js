import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ChatDetail from '../modules/chat/containers/ChatDetail'

export default class ChatDetailPage extends Component {
  constructor (props) {
    super(props)
    this.goBack = this.goBack.bind(this)
  }

  goBack () {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', flex: 1 }}>
          {/* <ChatDetail navigation={navigation} /> */}
        </View>
      </DefaultPage>
    )
  }
}

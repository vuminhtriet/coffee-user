import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text
} from 'react-native'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import DefaultPage from '../common/hocs/defaultPage'
import StoreHeader from '../modules/store/containers/StoreHeader'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}
export default class StoreDetailPage extends Component {
  render () {
    const { navigation } = this.props
    const id = navigation.getParam('id', null)
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <StoreHeader id={id} navigation={navigation} />
      </DefaultPage>
    )
  }
}

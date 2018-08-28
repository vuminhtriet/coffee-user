import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Platform
} from 'react-native'
import { ListItem, List } from 'react-native-elements'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class SortList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  render () {
    const { toggleSort } = this.props
    return (
      <View style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        ...Platform.select({
          ios: ifIphoneX({
            paddingTop: 32
          }, {
            paddingTop: 20
          }),
          android: {
            paddingTop: 0
          }
        })
      }}>
        <View style={{ width: '100%' }}>
          <HeaderTitle onBack={toggleSort} title={`Choose a filter`} />
        </View>
        <ScrollView contentContainerStyle={{ flex: 1 }} >
          {/* <Card containerStyle={{
            margin: 0,
            width: undefined,
            height: undefined
          }}
          > */}
          <List containerStyle={{ margin: 0, borderTopWidth: 0 }}>
            <ListItem
              title='Customers'
              containerStyle={{ borderBottomColor: '#e1e6ea' }}
              onPress={() => {}}
            />
            <ListItem
              title='Status'
              containerStyle={{ borderBottomColor: '#e1e6ea' }}
              onPress={() => {}}
            />
            <ListItem
              title='Shopping date'
              containerStyle={{ borderBottomColor: '#e1e6ea' }}
              onPress={() => {}}
            />
          </List>
          {/* </Card> */}
        </ScrollView>
      </View>)
  }
}

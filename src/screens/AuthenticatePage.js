import React, { Component } from 'react'
import {
  View,
  Dimensions
} from 'react-native'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import LoginForm from '../modules/user/containers/LoginForm'
import SignUpForm from '../modules/user/containers/SignUpForm'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}
export default class AuthenticatePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        { key: 'signin', title: 'SIGN IN' },
        { key: 'signup', title: 'SIGN UP' }
      ]
    }
    this.renderScene = this.renderScene.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.handleIndexChange = this.handleIndexChange.bind(this)
  }
  handleIndexChange (index) {
    this.setState({ index })
  }
  renderHeader (props) {
    return <TabBar
      {...props}
      style={{ backgroundColor: '#ffffff' }}
      labelStyle={{ color: '#2089E1', fontWeight: 'bold', fontSize: 16 }}
      indicatorStyle={{ backgroundColor: 'red' }}
    />
  }
  renderScene ({ route }) {
    const { navigation } = this.props
    switch (route.key) {
      case 'signin':
        return <LoginForm />
      case 'signup':
        return <SignUpForm navigation={navigation} />
      default:
        return null
    }
  }
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='SIGN IN / SIGN UP'
            canBack={false} onBack={() => navigation.goBack()}
          />
        </View>
        <TabViewAnimated
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
        />
      </DefaultPage>
    )
  }
}

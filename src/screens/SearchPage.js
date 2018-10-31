import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchShop'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import DefaultPage from '../common/hocs/defaultPage'
import PageSearchShops from '../modules/dashboard/containers/PageSearchShops'
import PageSearchProducts from '../modules/dashboard/containers/PageSearchProducts'

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width
  }

export default class SearchShopsPage extends Component {
  constructor (props) {
    super(props)
    const { navigation } = props
    const keyword = navigation.getParam('keyword', '')
    this.state = {
      keyword,
      index: 0,
      routes: [
        { key: 'shops', title: 'Quán cafe' },
        { key: 'drinks', title: 'Đồ uống' }
      ]
    }
    this.renderScene = this.renderScene.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.handleIndexChange = this.handleIndexChange.bind(this)
  }
  
  onSearch = (keyword) => {
    this.setState({ keyword })
  }

  renderScene({ route }) {
    const { keyword } = this.state
    switch (route.key) {
      case 'shops':
        return <PageSearchShops keyword={keyword} />
      case 'drinks':
        return <PageSearchProducts keyword={keyword} />
      default:
        return null
    }
  }

  renderLabel = (scene) => {
    const label = scene.route.title
    return <Text style={{ color: scene.index === this.state.index ? '#2089E1' : '#000' }}>{label}</Text>
  }

  handleIndexChange(index) {
    this.setState({ index })
  }

  renderHeader(props) {
    return <TabBar
      {...props}
      style={{ backgroundColor: '#ffffff' }}
      // labelStyle={{ fontWeight: 'bold', fontSize: 10 }}
      indicatorStyle={{ backgroundColor: 'red' }}
      renderLabel={this.renderLabel}
    />
  }

  render () {
    const { keyword } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header onSearch={this.onSearch} keyword={keyword} />
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

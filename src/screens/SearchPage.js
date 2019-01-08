import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
import { Icon } from 'react-native-elements'
import Header from '../common/components/elements/HeaderSearchShop'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import DefaultPage from '../common/hocs/defaultPage'
import PageSearchShops from '../modules/dashboard/containers/PageSearchShops'
import PageSearchProducts from '../modules/dashboard/containers/PageSearchProducts'
import RecommendProducts from '../modules/dashboard/containers/RecommendProducts'
import VisitedProducts from '../modules/dashboard/containers/VisitedProducts'
import VisitedShops from '../modules/dashboard/containers/VisitedShops'

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

  _onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    const { keyword } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#6F4E37'
        }}>
          {/* <Header onSearch={this.onSearch} keyword={keyword} /> */}
          <TouchableWithoutFeedback 
          onPress={this._onBack}>
          <View 
          style={{
            margin: 8,
            paddingLeft: 8,
            height: 40,
            flex: 1,
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}>
            <Icon
              name='search'
              size={26}
              style={{
                // color: '#FFFFFF',
                paddingLeft: 10
              }}
              type='font-awesome'
              color='black' />
            <Text style={{fontSize: 15, marginLeft: 8}}>
              {keyword}
            </Text>
          </View>
          </TouchableWithoutFeedback>
        </View>
        {/* {!keyword || keyword.length <= 0 &&
        <View>
          <RecommendProducts/>
          <VisitedShops/>
          <VisitedProducts/>
        </View>
        } */}
        {/* {keyword && keyword.length > 0 && */}
          <TabViewAnimated
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
          />
        {/* } */}
      </DefaultPage>
    )
  }
}

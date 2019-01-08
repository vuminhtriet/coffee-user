import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text,
  ScrollView
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchShop'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import DefaultPage from '../common/hocs/defaultPage'
import PageSearchShops from '../modules/dashboard/containers/PageSearchShops'
import PageSearchProducts from '../modules/dashboard/containers/PageSearchProducts'
import RecommendProducts from '../modules/dashboard/containers/RecommendProducts'
import VisitedProducts from '../modules/dashboard/containers/VisitedProducts'
import VisitedShops from '../modules/dashboard/containers/VisitedShops'
import HeaderSearch from '../common/components/elements/HeaderSearch'
import { SCREENS } from '../common/screens'

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width
  }

export default class SearchShopsPage extends Component {
  constructor (props) {
    super(props)
    const { navigation } = props
    const user = navigation.getParam('user', '')
    this.state = {
      user,
      index: 0,
      routes: [
        { key: 'shops', title: 'Quán cafe' },
        { key: 'drinks', title: 'Đồ uống' }
      ]
    }
  }
  
  onSearch = (keyword) => {
    this.props.navigation.navigate(SCREENS.SearchPage, { keyword: keyword })
  }

  render () {
    const { user } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderSearch
            onSearch={this.onSearch}
            />
        </View>
        <ScrollView>
          <RecommendProducts/>
          {user &&
            <View>
                <VisitedShops/>
                <VisitedProducts/>
            </View>
          }
        </ScrollView>
      </DefaultPage>
    )
  }
}

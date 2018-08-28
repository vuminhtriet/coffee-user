import React, { Component } from 'react'
import {
  View,
  ScrollView,
  RefreshControl
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import DashboardHeaderSearch from '../modules/dashboard/containers/DashboardHeaderSearch'
import DashboardFlashSaleProducts from '../modules/dashboard/containers/DashboardFlashSaleProducts'
import DashboardPopularProducts from '../modules/dashboard/containers/DashboardPopularProducts'
import DashboardCategoryList from '../modules/dashboard/containers/DashboardCategoryList'
import DashboardProductToday from '../modules/dashboard/containers/DashboardProductToday'
import DashboardSlider from '../modules/dashboard/containers/DashboardSlider'
import DashboardPopularShops from '../modules/dashboard/containers/DashboardPopularShops';

const ALL_REFRESH = 4
const MAX_TIME = 8000
export default class DashboardPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      refreshCount: 0
    }
    this.timeout = null
    this.onRefresh = this.onRefresh.bind(this)
    this.stopRefresh = this.stopRefresh.bind(this)
  }

  onRefresh () {
    this.timeout && clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({
        refreshing: false
      })
      this.timeout = null
    }, MAX_TIME)
    this.setState({
      refreshing: true
    })
  }

  stopRefresh () {
    let { refreshCount } = this.state
    refreshCount++
    if (refreshCount >= ALL_REFRESH) {
      this.timeout && clearTimeout(this.timeout)
      return this.setState({
        refreshing: false,
        refreshCount: 0
      })
    }
    this.setState({
      refreshCount
    })
  }

  render () {
    const { refreshing } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <DashboardHeaderSearch />
        </View>
        <ScrollView
          contentContainerStyle={{}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              title='Loading...'
            />
          }
        >
          <DashboardSlider
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardFlashSaleProducts
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardCategoryList
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardPopularShops
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardPopularProducts
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardProductToday
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
        </ScrollView>
      </DefaultPage>
    )
  }
}

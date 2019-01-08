import React, { Component } from 'react'
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import DashboardHeaderSearch from '../modules/dashboard/containers/DashboardHeaderSearch'
import DashboardFlashSaleProducts from '../modules/dashboard/containers/DashboardFlashSaleProducts'
import DashboardPopularProducts from '../modules/dashboard/containers/DashboardPopularProducts'
import DashboardStyleList from '../modules/dashboard/containers/DashboardStyleList'
import DashboardProductToday from '../modules/dashboard/containers/DashboardProductToday'
import DashboardSlider from '../modules/dashboard/containers/DashboardSlider'
import DashboardLocation from '../modules/dashboard/containers/DashboardLocation'
import DashboardNearbyShops from '../modules/dashboard/containers/DashboardNearbyShops'
import DashboardPopularShops from '../modules/dashboard/containers/DashboardPopularShops'
import DashboardPopularBrands from '../modules/dashboard/containers/DashboardPopularBrands'

const ALL_REFRESH = 4
const MAX_TIME = 8000
export default class DashboardPage extends Component {
  _didFocusSubscription
  _willBlurSubscription

  constructor (props) {
    super(props)
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
    this.state = {
      refreshing: false,
      refreshCount: 0,
      doExit: true
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

  componentDidMount() {
    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //   BackHandler.exitApp()
    //   return true
    // })
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove()
    this._willBlurSubscription && this._willBlurSubscription.remove()
  }

  onBackButtonPressAndroid = () => {
    BackHandler.exitApp()
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
          showsVerticalScrollIndicator = {false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              title='Loading...'
            />
          }
        >
          <DashboardLocation/>
          <DashboardSlider
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          {/* <DashboardFlashSaleProducts
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          /> */}
          <DashboardStyleList
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardPopularBrands
            refreshing={refreshing}
            stopRefresh={this.stopRefresh}
          />
          <DashboardNearbyShops
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

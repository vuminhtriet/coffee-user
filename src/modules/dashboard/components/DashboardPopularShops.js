import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  PermissionsAndroid
} from 'react-native'
import { withNavigation } from 'react-navigation'
import PopularShopItem from '../../../common/components/widgets/PopularShopItem'
import { SCREENS } from '../../../common/screens'

const { width } = Dimensions.get('window')
const ITEM_WITDH = 200
// (width - 10) / 2
const ITEM_HEIGHT = 222

class DashboardPopularShops extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      latitude: null,
      longitude: null,
      error: null
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  componentDidMount(){
    const { getDashboardPopularShops } = this.props
    getDashboardPopularShops()
  }

  // componentWillUpdate(){
  //   this.requestLocationPermission()
  // }

  // componentWillUnmount() {
  //   navigator.geolocation.clearWatch(this.watchId)
  // }

  // async requestLocationPermission() {
  //   const { getUserLocation } = this.props
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         'title': 'Cho phép định vị',
  //         'message': 'Drinkaway cần truy cập vào vị trí của bạn để hỗ trợ tìm kiếm quán cafe.'
  //       }
  //     )
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       this.watchId = navigator.geolocation.watchPosition(
  //       // navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           this.setState({
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //             error: null,
  //           })
  //           getUserLocation(this.state.latitude,this.state.longitude)
  //           console.log(position)
  //         },
  //         (error) => {
  //           this.setState({ error: error.message })
  //           console.log(error)
  //         },
  //         { enableHighAccuracy: true, timeout: 20000, maximumAge: 300000, distanceFilter: 10 },
  //       )
  //     } else {
  //       console.log("Permission denied")
  //     }
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getDashboardPopularShops } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getDashboardPopularShops().catch(() => { })
      stopRefresh()
    }
    // this.requestLocationPermission()
  }


  onRefresh() {
  }

  onLoadMore() {
  }

  _onNavigateToPopularShopsPage = () => {
    // const { latlng } = this.props
    // console.log(latlng)
    const { navigation } = this.props
    navigation.navigate(SCREENS.PopularShop)
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) => {
    const { latlng } = this.props
    return (
      <PopularShopItem
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
        latlng={latlng}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const { shops } = this.props

    return (
      <View style={{
        width: '100%',
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginBottom: 5,
        paddingBottom: 5
      }}>
        <View key='header'
          style={{ width: '100%', flexDirection: 'row', height: 40, alignItems: 'center', backgroundColor: '#FFFFFF' }}
        >
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Quán cafe phổ biến</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToPopularShopsPage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>XEM TẤT CẢ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 5 }}>
          <FlatList
            // showsHorizontalScrollIndicator={false}
            data={shops}
            // horizontal
            numColumns={2}
            refreshing={refreshing}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onRefresh={this.onRefresh}
            onEndReached={this.onLoadMore}
            onEndReachedThreshold={1}
          />
        </View>
      </View>)
  }
}

export default withNavigation(DashboardPopularShops)

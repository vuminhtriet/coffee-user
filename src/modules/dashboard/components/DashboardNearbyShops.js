import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native'
import { withNavigation } from 'react-navigation'
import PopularShopItem from '../../../common/components/widgets/PopularShopItem'
import { SCREENS } from '../../../common/screens'

const { width } = Dimensions.get('window')
const ITEM_WITDH = 200
// (width - 10) / 2
const ITEM_HEIGHT = 202

class DashboardNearbyShops extends Component {
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
    const { getDashboardNearbyShops, latlng } = this.props
    getDashboardNearbyShops(latlng.lat,latlng.lng)
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getDashboardNearbyShops, latlng  } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getDashboardNearbyShops(latlng.lat,latlng.lng).catch(() => { })
      stopRefresh()
    }
  }


  onRefresh() {
  }

  onLoadMore() {
  }

  _onNavigateToNearbyShopsPage = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.NearbyShop)
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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Thương hiệu gần bạn</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToNearbyShopsPage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>XEM TẤT CẢ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 5 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={shops}
            horizontal
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

export default withNavigation(DashboardNearbyShops)

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
import PopularBrandItem from '../../../common/components/widgets/PopularBrandItem'
import { SCREENS } from '../../../common/screens'

const { width } = Dimensions.get('window')
const ITEM_WITDH = 200
// (width - 10) / 2
const ITEM_HEIGHT = 172

class DashboardPopularBrands extends Component {
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
    const { getDashboardPopularBrands } = this.props
    getDashboardPopularBrands()
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getDashboardPopularBrands } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getDashboardPopularBrands().catch(() => { })
      stopRefresh()
    }
    // this.requestLocationPermission()
  }


  onRefresh() {
  }

  onLoadMore() {
  }

  _onNavigateToPopularBrandsPage = () => {
    // const { latlng } = this.props
    // console.log(latlng)
    const { navigation } = this.props
    navigation.navigate(SCREENS.Brand)
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) => {
    const { latlng } = this.props
    return (
      <PopularBrandItem
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const { brands } = this.props

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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Thương hiệu phổ biến</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToPopularBrandsPage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>XEM TẤT CẢ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 5 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={brands}
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

export default withNavigation(DashboardPopularBrands)

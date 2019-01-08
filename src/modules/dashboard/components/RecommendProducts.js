import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import PopularProductItem from '../../../common/components/widgets/PopularProductItem'
import { SCREENS } from '../../../common/screens'

const { width } = Dimensions.get('window')
const ITEM_WITDH = (width) / 2.5
const ITEM_HEIGHT = 210

class RecommendProducts extends Component {
  constructor(props) {
    super(props)
    const { user } = this.props
    this.state = {
      refreshing: false,
      keyword: user && user.keyword ? user.keyword : '',
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  componentDidMount() {
    const { getRecommendProducts } = this.props
    const { keyword } = this.state
    getRecommendProducts(keyword)
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getRecommendProducts } = this.props
    const { keyword } = this.state
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getRecommendProducts(keyword).catch(() => { })
      stopRefresh()
    }
  }


  onRefresh() {
  }

  onLoadMore() {
  }

  _onNavigateToPopularProductsPage = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.PopularProduct)
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) => {
    const { currencyUnits } = this.props
    return (
      <PopularProductItem
        currencyUnits={currencyUnits}
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const { products } = this.props

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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Có thể bạn thích</Text>
          </View>
          {/* <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToPopularProductsPage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>XEM TẤT CẢ</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={{ paddingHorizontal: 5 }}>
          <FlatList
            data={products}
            showsHorizontalScrollIndicator={false}
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

export default withNavigation(RecommendProducts)

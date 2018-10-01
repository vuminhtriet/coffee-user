import React, { Component } from 'react'
import moment from 'moment'
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { SCREENS } from '../../../common/screens'
import ProductFlashSaleDetail from '../../../common/components/widgets/ProductFlashSaleDetail'

const { width } = Dimensions.get('window')
const ITEM_WITDH = (width) / 2.5
const ITEM_HEIGHT = 330

class DashboardFlashSaldeProducts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  componentDidMount() {
    const { getFlashSaleProducts } = this.props
    getFlashSaleProducts()
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getFlashSaleProducts } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getFlashSaleProducts().catch(() => { })
      stopRefresh()
    }
  }

  onRefresh() {
  }

  onLoadMore() {
  }

  _keyExtractor = (item, index) => item.id

  _onNavigateToFlashSalePage = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.FlashSale)
  }

  _renderItem = ({ item }) => {
    const { currencyUnits } = this.props
    return (
      <ProductFlashSaleDetail
        currencyUnits={currencyUnits}
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const {
      coins,
      offset,
      products
    } = this.props

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
          <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>BIG </Text>
            <Image
              resizeMode='contain'
              style={{ height: 20, width: 50 }}
              source={require('../../../assets/logo/saleIcon.png')}
            />
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToFlashSalePage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          data={products}
          horizontal
          refreshing={refreshing}
          extraData={{ coins, offset }}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
      </View>)
    // return null
  }
}

export default withNavigation(DashboardFlashSaldeProducts)
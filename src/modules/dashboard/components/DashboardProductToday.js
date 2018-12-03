
import React, { Component } from 'react'
import {
  Text,
  View,
  Dimensions,
  FlatList
} from 'react-native'
import { withNavigation } from 'react-navigation'
import GridView from '../../../common/components/widgets/GridView'
import ProductItem from '../../../common/components/widgets/ProductItem'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 285

class DashboardProductToday extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      marginList: 0
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  componentDidMount () {
    const { getTodayProducts } = this.props

    getTodayProducts()
  }

  async componentWillReceiveProps (nextProps) {
    const { refreshing, stopRefresh, getTodayProducts } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getTodayProducts().catch(() => {})
      stopRefresh()
    }
  }

  onRefresh () {
  }

  onLoadMore () {
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) => {
    return (
      <ProductItem
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  render () {
    const { products } = this.props
    const { refreshing } = this.state

    return (
      <View
        style={{
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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Đồ uống hôm nay</Text>
          </View>
        </View>

        <FlatList
          data={products}
          showsVerticalScrollIndicator = {false}
          numColumns={NUMBER_OF_ITEM}
          refreshing={refreshing}
          extraData={refreshing}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
      </View>)
  }
}

export default withNavigation(DashboardProductToday)

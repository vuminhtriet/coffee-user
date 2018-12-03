import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { Icon } from 'react-native-elements'
import ProductItem from '../../../common/components/widgets/ProductItem'
import SubHeader from '../../../common/components/elements/SubHeader'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width - 10) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 285

export default class ProductList extends Component {
  constructor (props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = null
    this.state = {
      showFilter: false,
      showSort: false,
      refreshing: false,
      itemWidth: 140,
      marginList: 0
    }

    this.onLayout = this.onLayout.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }
  
  // componentDidMount() {
  //   const { getStoreProducts, id } = this.props
  //   id && getStoreProducts && getStoreProducts(id)
  // }

  onRefresh () {
  }

  onLoadMore () {
  }

  _renderItem = ({ item }) => {
    const { detail } = this.props
    // item.shop = detail
    return (
      <ProductItem
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
        shopName={detail.shopName}
      />
    )
  }

  keyExtractor (item) {
    return item.id
  }

  onLayout (event) {
  }

  onSort = () => {
    const { showSort } = this.state
    this.setState({
      showSort: !showSort
    })
  }

  onFilter = () => {
    const { showFilter } = this.state
    this.setState({
      showFilter: !showFilter
    })
  }

  render() {
    const { detail } = this.props
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          flex: 1,
          paddingBottom: 5
        }}>
        {/* <SubHeader
          onLeftComponent={
            <View style={{ marginLeft: 12 }}>
              <TouchableOpacity
                onPress={this.onSort}
              >
                <Text style={{ fontSize: 16 }}>Sort by popularity</Text>
              </TouchableOpacity>
            </View>
          }
          onRightComponent={
            <TouchableOpacity
              style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              onPress={this.onFilter}
            >
              <Icon
                name={'sort'}
                size={26}
                color='black'
                containerStyle={{}}
              />
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Filter</Text>
            </TouchableOpacity>
          }
        /> */}
        <FlatList
          columnWrapperStyle={{
            marginLeft: 5,
            marginRight: 5
          }}
          key='data'
          data={detail.products}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.3}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
        />
      </View>)
  }
}

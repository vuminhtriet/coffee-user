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
const ITEM_HEIGHT = 300

export default class ProductList extends Component {
  constructor (props) {
    super(props)
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
    const { products } = this.props
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5
        }}>
        <SubHeader
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
        />
        <FlatList
          columnWrapperStyle={{
            marginLeft: 5,
            marginRight: 5
          }}
          key='data'
          data={products}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={(item, index) => <ProductItem
            item={item.item}
            index={index}
            itemWith={ITEM_WITDH}
            itemHeight={ITEM_HEIGHT}
          />}
        />
      </View>)
  }
}

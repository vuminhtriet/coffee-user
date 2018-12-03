import React, { Component } from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native'
import { Icon } from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import Header from '../../../common/components/elements/HeaderSearchProduct'
import SubHeader from '../../../common/components/elements/SubHeader'
import ProductItem from '../../../common/components/widgets/ProductItem'
import SortList from '../../shop/components/SortList'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width - 10) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 285

export default class CategoryProducts extends Component {
  constructor(props) {
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

  componentDidMount() {
    const { categoryId, getCategoryProducts } = this.props
    getCategoryProducts(categoryId)
  }

  onRefresh() {
  }

  onLoadMore() {
  }

  keyExtractor(item) {
    return item.id
  }

  onLayout(event) {
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
    const { refreshing, showFilter, showSort } = this.state
    const { onBack, products } = this.props

    return (
      <View
        onLayout={this.onLayout}
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5
        }}
      >
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
        <Modal
          animationType='slide'
          transparent={false}
          visible={showFilter}
        >
          <SortList toggleSort={this.onFilter} />
        </Modal>
      </View>
    )
  }
}

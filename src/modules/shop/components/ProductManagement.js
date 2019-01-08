import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  FlatList
} from 'react-native'
import { Icon } from 'react-native-elements'
import { withNavigation } from 'react-navigation';
import { SCREENS } from '../../../common/screens'
import ProductItem from '../../../common/components/widgets/ProductItem'
import GridView from '../../../common/components/widgets/GridView'
import SubHeader from '../../../common/components/elements/SubHeader'
import ProductFilterList from '../../dashboard/components/ProductFilterList'
import ProductSortList from '../../dashboard/components/ProductSortList'
import { PRODUCT_SORT_LIST } from '../../../common/models';

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 285
const DEFAULT_SORT_TYPE = PRODUCT_SORT_LIST.find(item => item.type === 1)

class ProductManagement extends Component {
  constructor(props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = null
    this.state = {
      showFilter: false,
      showSort: false,
      refreshing: false,
      page: 1,
      isLastedPage: false,
      sortType: DEFAULT_SORT_TYPE || {},
      filterType: '',
      chosenCategories: [],
      chosenLocation: {
        districtId: '',
        cityId: ''
      },
      chosenPrice: {
        min: 0,
        max: 0
      }
    }
  }

  editProduct = (item) => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.EditProductPage, { product: item })
  }

  _onRefresh = () => {
    const { getShopProducts, shop } = this.props
    const { sortType } = this.state
    const options = this.submitFilter()
    this.setState({ refreshing: true }, async () => {
      await getShopProducts(shop, 0, sortType.value, options)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  componentWillMount() {
    const { getShopProducts, shop } = this.props

    this.setState({ refreshing: true }, async () => {
      await getShopProducts(shop)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }
  

  _onLoadMore = async () => {
    // const { getShopProducts, shop } = this.props
    // const { page, isLastedPage, sortType } = this.state
    // if (isLastedPage || this.onEndReachedCalledDuringMomentum) {
    //   return //
    // }
    // const rs = await getShopProducts(shop, page, sortType.value)
    // if (rs) {
    //   setTimeout(() => this.setState({ page: page + 1 }))
    // } else {
    //   setTimeout(() => this.setState({ isLastedPage: true }))
    // }
    // this.onEndReachedCalledDuringMomentum = true
  }

  _keyExtractor = (item) => item.id

  toggleSort = () => {
    const { showSort } = this.state
    this.setState({
      showSort: !showSort
    })
  }

  toggleFilter = () => {
    const { showFilter } = this.state
    this.setState({
      showFilter: !showFilter
    })
  }

  onSort = (id) => {
    const { getShopProducts, shop } = this.props
    const { sortType, showSort } = this.state
    if (sortType.id === id) {
      return false
    }
    else {
      const options = this.submitFilter()
      const newSortType = PRODUCT_SORT_LIST.find(item => item.id === id)
      this.setState({ refreshing: true, showSort: !showSort }, async () => {
        await getShopProducts(shop, 0, newSortType.value, options)
        this.setState({ refreshing: false, page: 1, isLastedPage: false, sortType: newSortType })
      })
    }
  }

  onFilter = () => {
    const { chosenCategories, chosenLocation, chosenPrice, showFilter, sortType } = this.state
    const { getShopProducts, shop } = this.props
    const options = this.submitFilter()
    this.setState({ refreshing: true, showFilter: !showFilter }, async () => {
      await getShopProducts(shop, 0, sortType.value, options)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  submitFilter = () => {
    const { chosenCategories, chosenLocation, chosenPrice } = this.state
    const options = {}
    if (chosenCategories.length > 0) {
      options.publicCategoryId = chosenCategories
    }
    if (chosenLocation.cityId) {
      options.cityId = chosenLocation.cityId
    }
    if (chosenLocation.districtId) {
      options.districtId = chosenLocation.districtId
    }
    if (chosenPrice.min) {
      options.min = chosenPrice.min
    }
    if (chosenPrice.max) {
      options.max = chosenPrice.max
    }
    return options
  }

  chooseCategory = (id) => {
    const { chosenCategories } = this.state
    const index = chosenCategories.indexOf(id)
    if (index >= 0) {
      this.setState({ chosenCategories: [...chosenCategories.slice(0, index), ...chosenCategories.slice(index + 1)] })
    }
    else {
      this.setState({ chosenCategories: [...chosenCategories].concat([id]) })
    }
  }

  choosePrice = (item) => {
    const { chosenPrice } = this.state
    this.setState({ chosenPrice: { ...chosenPrice, ...item } })
  }

  chooseLocation = (item) => {
    const { chosenLocation } = this.state
    this.setState({ chosenLocation: { ...chosenLocation, ...item } })
  }

  resetFilter = () => {
    this.setState({
      chosenCategories: [],
      chosenLocation: {
        districtId: '',
        cityId: ''
      },
      chosenPrice: {
        id: '',
        min: 0,
        max: 0
      }
    })
  }

  _renderItem = ({ item }) => {
    const { shop } = this.props
    return (
      <View
        style={{
          width: ITEM_WITDH,
          height: ITEM_HEIGHT
        }}
      >
        {item.status === -1 && <View
          style={{
            position: 'absolute',
            zIndex: 999,
            right: 10,
            top: 10,
            width: 60,
            height: 40,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red'
          }}
        >
          <Text style={{ fontWeight: 'bold', color: 'white' }}>
            Deleted
          </Text>
        </View>}

        <ProductItem
          item={item}
          itemWith={ITEM_WITDH}
          itemHeight={ITEM_HEIGHT}
          shopName={shop.shopName}
          onPress={this.editProduct}
        />
      </View>
    )
  }

  render() {
    const { refreshing, showFilter, showSort, filterType, sortType, chosenCategories, chosenLocation, chosenPrice } = this.state
    const { products } = this.props

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5,
          flexDirection: 'column'
        }}
      >
        <SubHeader
          onLeftComponent={
            <View style={{ marginLeft: 12 }}>
              <TouchableOpacity
                onPress={this.toggleSort}
              >
                <Text style={{ fontSize: 16 }}>Sắp xếp theo {sortType.title.toLowerCase()}</Text>
              </TouchableOpacity>
            </View>
          }
          onRightComponent={
            <TouchableOpacity
              style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              onPress={this.toggleFilter}
            >
              <Icon
                name={'sort'}
                size={26}
                color='black'
                containerStyle={{}}
              />
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Bộ lọc</Text>
            </TouchableOpacity>
          }
        />

        {/* <GridView
          style={{ flex: 1 }}
          data={products}
          numberOfColumns={NUMBER_OF_ITEM}
          itemComponent={this._renderItem}
          itemWith={ITEM_WITDH}
          itemHeight={ITEM_HEIGHT}
        /> */}

        <FlatList
          data={products}
          numColumns={NUMBER_OF_ITEM}
          refreshing={refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this._onRefresh}
          onEndReached={this._onLoadMore}
          onEndReachedThreshold={0.3}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
        />

        <Modal
          animationType='slide'
          transparent={false}
          visible={showFilter}
        >
          <ProductFilterList
            toggleFilter={this.toggleFilter}
            filterType={filterType}
            onFilter={this.onFilter}
            chooseCategory={this.chooseCategory}
            chosenCategories={chosenCategories}
            choosePrice={this.choosePrice}
            chosenPrice={chosenPrice}
            chooseLocation={this.chooseLocation}
            chosenLocation={chosenLocation}
            resetFilter={this.resetFilter}
          />
        </Modal>

        <Modal
          animationType='slide'
          transparent
          visible={showSort}
        >
          <ProductSortList toggleSort={this.toggleSort} sortType={sortType} onSort={this.onSort} />
        </Modal>
      </View>
    )
  }
}

export default withNavigation(ProductManagement)

import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native'
import { Icon } from 'react-native-elements'

import SubHeader from '../../../common/components/elements/SubHeader'
import ShopItem from '../../../common/components/widgets/ShopItem'
import ShopFilterList from './ShopFilterList'
import ShopSortList from './ShopSortList'
import { SHOP_SORT_LIST } from '../../../common/models';

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 280
const DEFAULT_SORT_TYPE = SHOP_SORT_LIST.find(item => item.type === 1)

export default class PageSearchShops extends Component {
  constructor(props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = null
    this.state = {
      showFilter: false,
      showSort: false,
      refreshing: false,
      itemWidth: 140,
      marginList: 0,
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
      },
      chosenStyle: {
        styleId: ''
      }
    }
  }

  componentDidMount() {
    const { searchShops, keyword } = this.props
    this.setState({ refreshing: true }, async () => {
      await searchShops(keyword)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { searchShops, keyword } = this.props
    if (nextProps.keyword && keyword !== nextProps.keyword) {
      this.setState({ refreshing: true }, async () => {
        await searchShops(nextProps.keyword)
        this.resetFilter()
        this.setState({ refreshing: false, page: 1, isLastedPage: false })
      })
    }
  }

  _onRefresh = () => {
    const { searchShops, keyword } = this.props
    const { sortType } = this.state
    const options = this.submitFilter()
    this.setState({ refreshing: true }, async () => {
      await searchShops(keyword, 0, sortType.value, options)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  _onLoadMore = async () => {
    // const { searchShops, keyword } = this.props
    // const { page, isLastedPage, sortType } = this.state
    // if (isLastedPage || this.onEndReachedCalledDuringMomentum) {
    //   return //
    // }
    // const options = this.submitFilter()
    // const rs = await searchShops(keyword, page, sortType.value, options)
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
    const { searchShops, keyword } = this.props
    const { sortType, showSort } = this.state
    if (sortType.id === id) {
      return false
    }
    else {
      const options = this.submitFilter()
      const newSortType = SHOP_SORT_LIST.find(item => item.id === id)
      this.setState({ refreshing: true, showSort: !showSort }, async () => {
        await searchShops(keyword, 0, newSortType.value, options)
        this.setState({ refreshing: false, page: 1, isLastedPage: false, sortType: newSortType })
      })
    }
  }

  onFilter = () => {
    const { chosenCategories, chosenLocation, chosenPrice, showFilter, sortType } = this.state
    const { searchShops, keyword } = this.props
    const options = this.submitFilter()
    this.setState({ refreshing: true, showFilter: !showFilter }, async () => {
      await searchShops(keyword, 0, sortType.value, options)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  submitFilter = () => {
    const { chosenCategories, chosenLocation, chosenPrice, chosenStyle } = this.state
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
    if (chosenStyle.styleId) {
      options.styleId = chosenStyle.styleId
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

  chooseStyle = (item) => {
    const { chosenStyle } = this.state
    this.setState({ chosenStyle: { ...chosenStyle, ...item } })
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
      },
      chosenStyle: {
        styleId: ''
      }
    })
  }

  _renderItem = ({ item }) => {
    const { latlng } = this.props
    return (
      <ShopItem
        item={item}
        itemWith={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
        latlng={latlng}
      />
    )
  }

  render() {
    const { refreshing, showFilter, showSort, filterType, sortType, chosenCategories, 
      chosenLocation, chosenPrice, chosenStyle } = this.state
    const { shops } = this.props

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          flex: 1,
          paddingBottom: 5
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

        <FlatList
          data={shops}
          numColumns={2}
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
          <ShopFilterList
            toggleFilter={this.toggleFilter}
            filterType={filterType}
            onFilter={this.onFilter}
            chooseCategory={this.chooseCategory}
            chosenCategories={chosenCategories}
            choosePrice={this.choosePrice}
            chosenPrice={chosenPrice}
            chooseLocation={this.chooseLocation}
            chosenLocation={chosenLocation}
            chooseStyle={this.chooseStyle}
            chosenStyle={chosenStyle}
            resetFilter={this.resetFilter}
          />
        </Modal>

        <Modal
          animationType='slide'
          transparent
          visible={showSort}
        >
          <ShopSortList toggleSort={this.toggleSort} sortType={sortType} onSort={this.onSort} />
        </Modal>
      </View>)
  }
}
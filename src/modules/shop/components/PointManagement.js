import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  FlatList,
  Image
} from 'react-native'
import { Icon } from 'react-native-elements'
import { withNavigation } from 'react-navigation';
import { SCREENS } from '../../../common/screens'
import ProductItem from '../../../common/components/widgets/ProductItem'
import GridView from '../../../common/components/widgets/GridView'
import SubHeader from '../../../common/components/elements/SubHeader'
import PointSort from '../../shop/components/PointSort'
import { POINT_SORT_LIST } from '../../../common/models';

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 250
const DEFAULT_SORT_TYPE = POINT_SORT_LIST.find(item => item.type === 1)

class PointItem extends PureComponent {
  render() {
    const {
      itemWidth,
      onPress,
      itemHeight,
      item
    } = this.props

    // onPress = () => {
    //   const { item, navigation, onPress } = this.props
    //   if (onPress) {
    //     onPress(item)
    //   }
    //   else {
    //     navigation.navigate(SCREENS.ProductDetail, { productItem: item })
    //   }
    // }

    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          height: itemHeight,
          flexDirection: 'column',
          padding: 10,
          paddingBottom: 0
        }}
        onPress={() => onPress(item)}
      >

        <View style={{
          padding: 5,
          flex: 1}}>
          <View style= {{flexDirection: 'column'}}>
          {item.member && item.member.userPhoto && item.member.userPhoto.length > 0
            ? <Image
              style={{ height: 155 }}
              source={{ uri: item.member.userPhoto }}
            /> : <Image
              style={{ height: 155, width: '100%' }}
              source={{ uri : 'https://qualiscare.com/wp-content/uploads/2017/08/default-user.png' }}
            />
          }
          <Text numberOfLines = {1} style={{ fontWeight: 'bold',
          fontSize: 17}}>
              {`${item.member && item.member.displayName || 'none'}`}
          </Text>

          <Text numberOfLines = {1} style={{alignContent: 'flex-end', fontWeight: 'bold'
            , alignItems: 'flex-end', justifyContent: 'flex-end', fontSize: 18, color: 'green'}}>
              {`${item.point || 0} điểm`} 
            </Text>

          </View>
          {/* <View style={{width: 20}}/> */}
        </View>


      </TouchableOpacity>
    )
  }
}

class PointManagement extends Component {
  constructor(props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = null
    this.state = {
      showFilter: false,
      showSort: false,
      refreshing: false,
      page: 1,
      isLastedPage: false,
      sortType: DEFAULT_SORT_TYPE || {}
    }
  }

  goToDetail = (item) => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.DetailPointList, { userPoint: item })
  }

  _onRefresh = () => {
    const { getUserPoints, shop } = this.props
    const { sortType } = this.state
    this.setState({ refreshing: true }, async () => {
      await getUserPoints(shop, 0, sortType.value)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  componentWillMount() {
    const { getUserPoints, shop } = this.props

    this.setState({ refreshing: true }, async () => {
      await getUserPoints(shop)
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

  onSort = (id) => {
    const { getUserPoints, shop } = this.props
    const { sortType, showSort } = this.state
    if (sortType.id === id) {
      return false
    }
    else {
      const newSortType = POINT_SORT_LIST.find(item => item.id === id)
      this.setState({ refreshing: true, showSort: !showSort }, async () => {
        await getUserPoints(shop, 0, newSortType.value)
        this.setState({ refreshing: false, page: 1, isLastedPage: false, sortType: newSortType })
      })
    }
  }

  _renderItem = ({ item }) => {
    const { shop } = this.props
    return (
      <PointItem
        item={item}
        itemWidth={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
        onPress={this.goToDetail}
      />
    )
  }

  render() {
    const { refreshing, showSort, sortType } = this.state
    const { userPoints } = this.props

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
                // onPress={this.toggleSort}
              >
                <Text style={{ fontSize: 16 }}>Sắp xếp theo {sortType.title.toLowerCase()}</Text>
              </TouchableOpacity>
            </View>
          }
          // onRightComponent={
          //   <TouchableOpacity
          //     style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          //     onPress={this.toggleFilter}
          //   >
          //     <Icon
          //       name={'sort'}
          //       size={26}
          //       color='black'
          //       containerStyle={{}}
          //     />
          //     <Text style={{ fontSize: 16, lineHeight: 26 }}>Bộ lọc</Text>
          //   </TouchableOpacity>
          // }
        />

        <FlatList
          data={userPoints}
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
          transparent
          visible={showSort}
        >
          <PointSort toggleSort={this.toggleSort} sortType={sortType} onSort={this.onSort} />
        </Modal>
      </View>
    )
  }
}

export default withNavigation(PointManagement)

import React, { Component, PureComponent } from 'react'
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
import DetailPointSort from '../../shop/components/DetailPointSort'
import moment from 'moment'
import { DETAIL_POINT_SORT_LIST } from '../../../common/models';

const { width } = Dimensions.get('window')
const ITEM_HEIGHT = 100
const DEFAULT_SORT_TYPE = DETAIL_POINT_SORT_LIST.find(item => item.type === 1)

class PointItem extends PureComponent {
  render() {
    const {
      itemHeight,
      item
    } = this.props

    return (
      <View
        style={{
          height: itemHeight,
          flexDirection: 'column',
          padding: 10,
          paddingBottom: 0
        }}
      >

        <View style={{ flexDirection: 'row',
          padding: 5, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center',
          flex: 1}}>
          <View style= {{flexDirection: 'column'}}>
          
            <Text numberOfLines = {1} style={{ fontWeight: 'bold',
            fontSize: 17}}>
                {`Mã HĐ: ${item.code}`}
            </Text>

            <Text numberOfLines = {1} style={{
            fontSize: 15}}>
                {`Số tiền: ${item.money}đ`}
            </Text>

            <Text numberOfLines = {1} style={{
            fontSize: 15}}>
                {`${moment(item.dateCreatedAt).format('DD-MM-YYYY HH:mm')}`}
            </Text>

          </View>
            <Text numberOfLines = {1} style={{fontWeight: 'bold'
                , fontSize: 18, color: 'green'}}>
                {`${item.point} điểm`} 
                </Text>
        </View>
        <View style={{marginTop: 12, width: '100%', height: 1, backgroundColor: '#DCDCDC'}}/>

      </View>
    )
  }
}

class DetailPointManagement extends Component {
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

  _onRefresh = () => {
    const { getDetailPoints, userPoint } = this.props
    const { sortType } = this.state
    this.setState({ refreshing: true }, async () => {
      await getDetailPoints(userPoint, 0, sortType.value)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  componentWillMount() {
    const { getDetailPoints, userPoint } = this.props

    this.setState({ refreshing: true }, async () => {
      await getDetailPoints(userPoint)
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
    const { getDetailPoints, userPoint } = this.props
    const { sortType, showSort } = this.state
    if (sortType.id === id) {
      return false
    }
    else {
      const newSortType = DETAIL_POINT_SORT_LIST.find(item => item.id === id)
      this.setState({ refreshing: true, showSort: !showSort }, async () => {
        await getDetailPoints(userPoint, 0, newSortType.value)
        this.setState({ refreshing: false, page: 1, isLastedPage: false, sortType: newSortType })
      })
    }
  }

  _renderItem = ({ item }) => {
    const { shop } = this.props
    return (
      <PointItem
        item={item}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  render() {
    const { refreshing, showSort, sortType } = this.state
    const { pointDetailLists } = this.props

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
          data={pointDetailLists}
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
          <DetailPointSort toggleSort={this.toggleSort} sortType={sortType} onSort={this.onSort} />
        </Modal>
      </View>
    )
  }
}

export default withNavigation(DetailPointManagement)

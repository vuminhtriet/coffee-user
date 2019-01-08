import React, { Component, PureComponent } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { Icon } from 'react-native-elements'

import { SCREENS } from '../../../common/screens'
import BrandItem from '../../../common/components/widgets/BrandItem'
import SubHeader from '../../../common/components/elements/SubHeader'
import SortList from '../../shop/components/SortList'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 232

class PageBrands extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showFilter: false,
      refreshing: false
    }
  }

  componentDidMount() {
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) => {
    const image = item.brandImg && item.brandImg.length > 0 && item.brandImg
    return (
      <BrandItem
        item={item}
        // totalProduct={item.shops.length}
        itemWidth={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  onFilter = () => {
    const { showFilter } = this.state
    this.setState({
      showFilter: !showFilter
    })
  }

  _onRefresh = () => {
    const { getBrands } = this.props

    this.setState({ refreshing: true }, async () => {
      await getBrands()
      this.setState({ refreshing: false })
    })
  }

  _onLoadMore = () => {

  }

  render() {
    const { refreshing, showFilter } = this.state
    const { brands } = this.props
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          flex: 1,
          paddingBottom: 35
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
          data={brands}
          numColumns={2}
          refreshing={refreshing}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onRefresh={this._onRefresh}
          onEndReached={this._onLoadMore}
          onEndReachedThreshold={0.3}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
        />

        {/* <Modal
          animationType='slide'
          transparent={false}
          visible={showFilter}
        >
          <SortList toggleSort={this.onFilter} />
        </Modal> */}
      </View>)
  }
}

export default withNavigation(PageBrands)
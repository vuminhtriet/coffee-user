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
import CategoryItem from '../../../common/components/widgets/CategoryItem'
import SubHeader from '../../../common/components/elements/SubHeader'
import SortList from '../../shop/components/SortList'

const { width } = Dimensions.get('window')
const ITEM_WITDH = (width) / 3
const ITEM_HEIGHT = 190

class PageCategories extends PureComponent {
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
    const image = item.images && item.images.length > 0 && item.images[0].fullUrl
    return (
      <CategoryItem
        id={item.id}
        image={image}
        name={item.name}
        totalProduct={item.totalProduct}
        itemWidth={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  _onNavigateToCategoryPage = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.Category)
  }

  onFilter = () => {
    const { showFilter } = this.state
    this.setState({
      showFilter: !showFilter
    })
  }

  _onRefresh = () => {
    const { getCategories } = this.props

    this.setState({ refreshing: true }, async () => {
      await getCategories()
      this.setState({ refreshing: false })
    })
  }

  _onLoadMore = () => {

  }

  render() {
    const { refreshing, showFilter } = this.state
    const { categories } = this.props
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          flex: 1,
          paddingBottom: 35
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
          data={categories}
          numColumns={3}
          refreshing={refreshing}
          extraData={categories}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onRefresh={this._onRefresh}
          onLoadMore={this._onLoadMore}
          onEndReachedThreshold={1}
        />

        <Modal
          animationType='slide'
          transparent={false}
          visible={showFilter}
        >
          <SortList toggleSort={this.onFilter} />
        </Modal>
      </View>)
  }
}

export default withNavigation(PageCategories)
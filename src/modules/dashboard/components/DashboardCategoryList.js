import React, { Component, PureComponent } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { SCREENS } from '../../../common/screens'
import CategoryItem from '../../../common/components/widgets/CategoryItem'

const { width } = Dimensions.get('window')
const ITEM_WITDH = (width - 10) / 3
const ITEM_HEIGHT = 190

class DashboardCategoryList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    const { getCategories } = this.props
    getCategories()
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getCategories } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getCategories()
      stopRefresh()
    }
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

  render() {
    const { refreshing } = this.state
    const { categories } = this.props
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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Categories</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToCategoryPage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 5 }}>
          <FlatList
            data={categories}
            numColumns={3}
            refreshing={refreshing}
            extraData={categories}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onEndReachedThreshold={1}
          />
        </View>
      </View>)
  }
}

export default withNavigation(DashboardCategoryList)
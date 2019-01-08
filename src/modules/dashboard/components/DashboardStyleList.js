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
import StyleItem from '../../../common/components/widgets/StyleItem'

const { width } = Dimensions.get('window')
const ITEM_WITDH = (width - 10) / 3
const ITEM_HEIGHT = 190

class DashboardStyleList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    const { getStyles } = this.props
    getStyles()
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getStyles } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getStyles()
      stopRefresh()
    }
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) => {
    const image = item.styleImg && item.styleImg.length > 0 && item.styleImg
    return (
      <StyleItem
        id={item.id}
        image={image}
        name={item.name}
        totalShop={item.shops.length}
        itemWidth={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
      />
    )
  }

  _onNavigateToStylePage = () => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.Style)
  }

  render() {
    const { refreshing } = this.state
    const { styles } = this.props
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
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#E64B47' }}>Phong cách quán</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <TouchableOpacity onPress={this._onNavigateToStylePage}>
              <Text style={{ textAlign: 'right', color: '#67B6F4' }}>XEM TẤT CẢ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 5 }}>
          <FlatList
            data={styles}
            numColumns={3}
            refreshing={refreshing}
            extraData={styles}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onEndReachedThreshold={1}
          />
        </View>
      </View>)
  }
}

export default withNavigation(DashboardStyleList)
import React, { Component } from 'react'
import {
  FlatList,
  View
} from 'react-native'
import { ListItem } from 'react-native-elements'
import { SCREENS } from '../../../common/screens';
import { withNavigation } from 'react-navigation';

class CategoryList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }

  renderItem({ item, index }) {
    const image = (item.image) || {}
    return (
      <ListItem
        roundAvatar
        onPress={() => this._onNavigateToCategoryPage(item)}
        avatar={image.fullUrl
          ? { uri: image.fullUrl }
          : require('../../../assets/placeholder.png')}
        key={index}
        title={item.name}
        subtitle={`${item.totalProduct} products`}
      />
    )
  }

  onRefresh() {
  }

  onLoadMore() {
  }

  keyExtractor(item) {
    return item.id
  }

  _onNavigateToCategoryPage = (item) => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.StoreCategoryProduct, {
      categoryId: item.id
    })
  }

  render() {
    const { refreshing } = this.state
    const { categories } = this.props

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5
        }}>
        <FlatList
          data={categories}
          refreshing={refreshing}
          extraData={{ ...categories }}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
          contentContainerStyle={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center'
          }}
        />
      </View>
    )
  }
}

export default withNavigation(CategoryList)

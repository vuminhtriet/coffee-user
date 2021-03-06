import React, { Component } from 'react'
import {
  FlatList,
  View,
  Dimensions,
  Text
} from 'react-native'
import { ListItem } from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
const { height } = Dimensions.get('window')

export default class CategoryList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      categories: {}
    }

    this.goBack = this.goBack.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.select = this.select.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }

  goBack () {
    const { categories: selected } = this.state
    const { selectCategories } = this.props
    selectCategories(selected)
  }

  select (item) {
    this.setState({
      categories: item
    })
  }

  renderItem ({ item, index }) {
    const { categories } = this.state
    return (
      <ListItem
        roundAvatar
        onPress={() => this.select(item)}
        // avatar={{source: require('../../../assets/placeholder.png')}}
        // {item.images && item.images.length > 0 ? { uri: item.images[0].fullUrl } : require('../../../assets/placeholder.png')}
        key={index}
        title={`${index + 1}. ${item.name}`}
        // subtitle={`${item.products && item.products.length} đồ uống`}
        subtitle={
          <Text style={{marginLeft: 28}}>{`${item.products && item.products.length} đồ uống`}</Text>
        }  
        rightIcon={
          categories.id === item.id
            ? { name: 'check', color: 'green' }
            : undefined
        }
      />
    )
  }

  async componentDidMount () {
    const { getPrivateCategories, shop } = this.props

    this.setState({ refreshing: true }, async () => {
      await getPrivateCategories(shop)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  onRefresh () {
  }

  onLoadMore () {
  }

  keyExtractor (item) {
    return `${item.id}_${item.shopId || ''}`
  }

  render () {
    const { refreshing, allCategory } = this.state
    const { categories } = this.props
    return (
      <DefaultPage
        styles={{ flexDirection: 'column', height }}
      >
        <View style={{ width: '100%', height: undefined }}>
          <HeaderTitle title='Thêm danh mục' onBack={this.goBack} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <FlatList
            data={categories}
            refreshing={refreshing}
            extraData={{ ...categories || [] }}
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
      </DefaultPage>
    )
  }
}

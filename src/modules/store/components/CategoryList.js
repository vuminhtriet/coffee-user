import React, { Component } from 'react'
import {
  FlatList,
  Dimensions,
  View
} from 'react-native'
import { ListItem } from 'react-native-elements'
import { TEST_URL } from '../../../common/models'
import { SCREENS } from '../../../common/screens';
import { withNavigation } from 'react-navigation';
import axios from 'axios'
import CategoryItem from '../../../common/components/widgets/CategoryItem';
const test_categories = [{"id":1,"shopId":1,"categoryName":"Coffee"}]

const { width } = Dimensions.get('window')
const ITEM_WITDH = (width - 10) / 3
const ITEM_HEIGHT = 190

class CategoryList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      // categories: null
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }

  componentDidMount() {
    // const { navigation, id } = this.props
    // const url = `${TEST_URL}/api/categories?filter[where][shopId]=${id}`

    // this.setState({ loading: true }, () => {
    //   axios({
    //     url,
    //     timeout: 5000
    //   })
    //     .then(response => {
    //       const privateCategories = response.data
    //       this.setState({
    //         categories: privateCategories,
    //         loading: false
    //       })
    //     })
    //     .catch(e => {
    //       this.setState({ categories: null, loading: false })
    //     })
    // })
  }

  renderItem({ item, index }) {
    return (
      // <ListItem
      //   roundAvatar
      //   onPress={() => this._onNavigateToCategoryPage(item)}
      //   avatar={image
      //     ? { uri: image }
      //     : require('../../../assets/placeholder.png')}
      //   key={index}
      //   title={item.categoryName}
      //   subtitle={`${item.id} products`}
      // />
      <CategoryItem
        id={item.id}
        shopId={item.shopId}
        image={item.image}
        name={item.name}
        totalProduct={item.products.length}
        itemWidth={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
        index={index}
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
        <View style={{ padding: 5 }}>
          <FlatList
            // data={privateCategories}
            // refreshing={refreshing}
            // extraData={{ ...privateCategories }}
            // keyExtractor={this.keyExtractor}
            // renderItem={this.renderItem}
            // onRefresh={this.onRefresh}
            // onEndReached={this.onLoadMore}
            // onEndReachedThreshold={1}
            // contentContainerStyle={{
            //   flexDirection: 'column',
            //   width: '100%',
            //   justifyContent: 'center'
            // }}
            data={categories}
              // numColumns={3}
              contentContainerStyle={{
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center'
              }}
              refreshing={refreshing}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              onEndReachedThreshold={1}
          />
        </View>
      </View>
    )
  }
}

export default withNavigation(CategoryList)

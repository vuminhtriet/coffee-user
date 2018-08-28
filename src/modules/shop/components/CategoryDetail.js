import React, { Component } from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { ListItem, FormLabel, FormInput } from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class CategoryDetail extends Component {
  constructor (props) {
    super(props)
    const { category } = props
    this.state = {
      refreshing: false,
      showDetail: false,
      category: null,
      products: [],
      categoryProducts: [],
      categoryName: category.name
    }

    this.submit = this.submit.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.changeProduct = this.changeProduct.bind(this)
    this.changeCategoryName = this.changeCategoryName.bind(this)
  }

  changeCategoryName (text) {
    this.setState({
      categoryName: text
    })
  }

  async submit () {
    const { products, categoryName } = this.state
    const {
      products: defaultProducts,
      getPrivateCategories,
      getShopProducts,
      category,
      submit,
      token,
      shop,
      onBack
    } = this.props
    const deletes = []
    const add = []
    defaultProducts.forEach(product => {
      const change = products.find(element => element.id === product.id)
      if (product.privateCategoryId === null &&
        change.privateCategoryId !== null) {
        add.push(change)
      } else if (product.privateCategoryId !== null &&
        change.privateCategoryId === null) {
        deletes.push(change)
      }
    })
    if (add.length === 0 && deletes.length === 0 && category.name === categoryName) {
      onBack()
    } else {
      await submit(token, category, shop, categoryName, deletes, add)
      await getShopProducts(shop)
      getPrivateCategories(shop)
      onBack()
    }
  }

  changeProduct (item) {
    const { category } = this.props
    const { products } = this.state
    const newProducts = products.map(product => {
      let newProduct = { ...product }
      if (newProduct.id === item.id && newProduct.privateCategoryId !== null) {
        newProduct.privateCategoryId = null
      } else if (newProduct.id === item.id && newProduct.privateCategoryId === null) {
        newProduct.privateCategoryId = category.id
      }
      return newProduct
    })
    this.setState({
      products: [
        ...newProducts
      ]
    })
  }

  renderItem ({ item, index }) {
    const { category } = this.props
    const inCategory = item.privateCategoryId === category.id
    const image = (item.images && item.images[0]) || {}
    return (
      <ListItem
        roundAvatar
        avatar={
          image.fullUrl
            ? { uri: image.fullUrl }
            : require('../../../assets/placeholder.png')
        }
        key={index}
        title={item.name}
        subtitle={`${item.description}`}
        onPress={() => this.changeProduct(item)}
        rightIcon={{ name: 'check', color: inCategory ? '#77BDE3' : undefined }}
      />
    )
  }

  async componentDidMount () {
    const { products, category, getProductsInCategories } = this.props
    const categoryProducts = await getProductsInCategories(category.id)
    this.setState({
      categoryProducts,
      products: [...products.map(item => {
        return {
          ...item
        }
      })]
    })
  }

  onRefresh () {
  }

  onLoadMore () {
  }

  keyExtractor (item) {
    return item.id
  }

  render () {
    const { refreshing, products, categoryName } = this.state
    const { onBack } = this.props

    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Category products'
            onBack={onBack}
            rightIcon={
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  zIndex: 1,
                  height: 30,
                  borderColor: '#FFFFFF',
                  justifyContent: 'center'
                }}
                onPress={this.submit}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Done</Text>
              </TouchableOpacity>
            }
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <View style={{ height: 70, width: '100%', paddingTop: 10 }} >
            <View style={{ flex: 1, height: 70 }}>
              <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Category name
                </Text>
              </View>
            </View>
            <FormInput value={categoryName} onChangeText={this.changeCategoryName} />
          </View>
          <View style={{ height: 70, width: '100%', flexDirection: 'row' }} >
            <View style={{ flex: 1, height: 70 }}>
              <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Choose products as below to add into your own category
                </Text>
              </View>
            </View>
          </View>
          <FlatList
            data={products}
            refreshing={refreshing}
            extraData={{ ...products }}
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
      </DefaultPage>)
  }
}

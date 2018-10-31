import React, { Component } from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native'
import { ListItem, FormLabel, FormInput } from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import { isEmpty } from 'lodash'
import axios from 'axios'

export default class CategoryDetail extends Component {
  constructor (props) {
    super(props)
    const { category } = props
    this.state = {
      refreshing: false,
      showDetail: false,
      category: null,
      products: [],
      disabled: false,
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
    this.setState({ disabled: true })
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
    if(categoryName.replace(/\s/g, '').length === 0){
      return Alert.alert(
        'KHÔNG THỂ CẬP NHẬT',
        'Tên danh mục không được trống',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        { cancelable: false }
      )
    }

    const tempProducts = []
    defaultProducts.forEach(product => {
      if (product.categoryId === null || product.categoryId === category.id) {
        tempProducts.push(product)
      }
    })
    
    tempProducts.forEach(product => {
      const change = products.find(element => element.id === product.id)
      if (product.categoryId === null &&
        change.categoryId !== null) {
        add.push(change)
      } else if (product.categoryId !== null &&
        change.categoryId === null) {
        deletes.push(change)
      }
    })
    if (add.length === 0 && deletes.length === 0 && category.name === categoryName) {
      onBack()
      this.setState({ disabled: false })
    } else {
      await submit(token, category, shop, categoryName, deletes, add)
        await getShopProducts(shop)
        getPrivateCategories(shop)
        onBack()
        this.setState({ disabled: false })
    }
    this.setState({ disabled: true })
  }

  changeProduct (item) {
    const { category } = this.props
    const { products } = this.state
    const newProducts = products.map(product => {
      let newProduct = { ...product }
      if (newProduct.id === item.id && newProduct.categoryId !== null) {
        newProduct.categoryId = null
      } else if (newProduct.id === item.id && newProduct.categoryId === null) {
        newProduct.categoryId = category.id
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
    const { disabled } = this.state
    const inCategory = item.categoryId === category.id
    const image = (item.productCoverImage && item.productCoverImage[0]) || ''
    return (
      <ListItem
        roundAvatar
        avatar={
          image
            ? { uri: image }
            : require('../../../assets/drinkplaceholder.png')
        }
        key={index}
        title={item.productName}
        subtitle={`${item.productDescription}`}
        onPress={() => this.changeProduct(item)}
        rightIcon={{ name: 'check', color: inCategory ? '#77BDE3' : undefined }}
        disabled={disabled}
      />
    )
  }

  async componentDidMount () {
    const { products, category, getProductsInCategories, shop } = this.props
    const categoryProducts = await getProductsInCategories(category.id, shop.id)
    const tempProducts = []
    products.forEach(product => {
      if (product.categoryId === null || product.categoryId === category.id) {
        tempProducts.push(product)
      }
    })
    this.setState({
      categoryProducts,
      products: [...tempProducts.map(item => {
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
    const { refreshing, products, categoryName, disabled } = this.state
    const { onBack } = this.props

    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Đồ uống theo danh mục'
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
                disabled={disabled}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Xong</Text>
              </TouchableOpacity>
            }
          />
        </View>
        <View style={{ width: '100%', flex: 1 ,
          paddingBottom: 5 }}>
          <View style={{ height: 70, width: '100%', paddingTop: 10 }} >
            <View style={{ flex: 1, height: 70 }}>
              <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Tên danh mục
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
                  Chọn đồ uống bên dưới để thêm vào danh mục
                </Text>
              </View>
            </View>
          </View>
          <View
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            flex: 1,
            flexDirection: 'column',
            paddingBottom: 5
          }}>
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
            <View style={{width: '100%', height: 20}}/>
          </View>
        </View>
      </DefaultPage>)
  }
}

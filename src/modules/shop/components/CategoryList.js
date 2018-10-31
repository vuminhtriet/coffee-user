import React, { Component } from 'react'
import {
  FlatList,
  View,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native'
import { Button, Card, FormInput, FormLabel, Icon, ListItem, FormValidationMessage } from 'react-native-elements'
import CategoryDetail from '../containers/CategoryDetail'
import SubHeader from '../../../common/components/elements/SubHeader'
import Modal from '../../../common/components/elements/Modal'
import axios from 'axios'
import { TEST_URL } from '../../../common/models'
const { height } = Dimensions.get('window')

export default class CategoryList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      showDetail: false,
      category: null,
      categoryName: '',
      categoryNameError: null
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.showDetail = this.showDetail.bind(this)
    this.onDetailBack = this.onDetailBack.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
    this.addNewCategory = this.addNewCategory.bind(this)
  }

  async addNewCategory () {
    const { categoryName } = this.state
    const {
      addCategory,
      shop,
      token,
      openAddCategory,
      getPrivateCategories
    } = this.props
    if (!categoryName) {
      return this.setState({
        categoryNameError: 'Thiếu tên danh mục.'
      })
    }
    const result = await addCategory(token, shop, categoryName)
    if (!result) {
      return this.setState({
        categoryNameError: `Không thể tạo danh mục.`
      })
    }
    openAddCategory()
    getPrivateCategories(shop)
  }

  async deleteCategory (item) {
    const { shop, token, deleteCategory, getPrivateCategories } = this.props
    if (parseInt(item.products.length) <= 0) {
      await deleteCategory(token, shop, item)
      getPrivateCategories(shop)
    }
  }

  onDetailBack () {
    this.setState({
      category: null,
      showDetail: false
    })
  }

  async componentDidMount () {
    const { getPrivateCategories, shop } = this.props

    this.setState({ refreshing: true }, async () => {
      await getPrivateCategories(shop)
      this.setState({ refreshing: false, page: 1, isLastedPage: false })
    })
  }

  // getTotalProduct (id) {
  //   const { shop } = this.props
  //   // const url = `${TEST_URL}/api/categories/${id}/products/count`
  //   const url = `${TEST_URL}/api/products?filter[where][categoryId]=${id}&filter[where][shopId]=${shop.id}`

  //   this.setState({ loading: true }, () => {
  //     axios({
  //       url,
  //       timeout: 5000
  //     })
  //       .then(response => {
  //         const item = response.data
  //         this.setState({ loading: false })
  //         return item.length
  //       })
  //       .catch(e => {
  //         this.setState({ loading: false })
  //         return 0
  //       })
  //   })
  // }

  renderItem ({ item, index }) {
    // const image = item.image || {}
    return (
      <ListItem
        roundAvatar
        onPress={() => this.showDetail(item)}
        avatar={{source: require('../../../assets/placeholder.png')}}
          // image
          // ? { uri: image }
          // : 
          // require('../../../assets/placeholder.png')}
        key={index}
        title={item.name}
        subtitle={`${item.products && item.products.length} đồ uống`}
        rightIcon={parseInt(item.products && item.products.length) <= 0 ? { name: 'delete', color: '#E44C4C' } : undefined}
        onPressRightIcon={() => this.deleteCategory(item)}
      />
      // <Text>sadasd</Text>
    )
  }

  onRefresh () {
  }

  onLoadMore () {
  }

  onSort (item){
    return Alert.alert(
          'CANT SIGN UP',
          JSON.stringify(item),
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
          ],
          { cancelable: false }
        )
  }

  keyExtractor (item) {
    return item.id
  }

  showDetail (item) {
    this.setState({
      category: item,
      showDetail: true
    })
  }

  render () {
    const { categoryName, categoryNameError, refreshing, showDetail, category } = this.state
    const { categories, addCategoryModal, openAddCategory, shop } = this.props

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5,
          flexDirection: 'column'
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
          data={categories || {}}
          refreshing={refreshing}
          // extraData={{ ...tempCate }}
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
        <Modal
          animationType='slide'
          transparent={false}
          visible={showDetail}
        >
          <View style={{ width: '100%', height }}>
            <CategoryDetail category={category} onBack={this.onDetailBack} />
          </View>
        </Modal>
        <Modal
          transparent
          visible={addCategoryModal}
        >
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity
              onPress={openAddCategory}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
                backgroundColor:
                '#000',
                opacity: 0.2 }}
              />
            <View style={{ width: '100%', height: 300, zIndex: 2 }}>
              <Card title='Thêm danh mục'>
                <FormLabel>
                  Tên danh mục
                </FormLabel>
                <FormInput
                  value={categoryName || ''}
                  placeholder='Nhập tên danh mục'
                  onChangeText={text => this.setState({
                    categoryName: text,
                    categoryNameError: undefined
                  })}
                />
                {categoryNameError &&
                  <FormValidationMessage>{ categoryNameError }</FormValidationMessage>}
                <Button
                  containerViewStyle={{ marginTop: 10 }}
                  onPress={this.addNewCategory}
                  title='Thêm'
                />
              </Card>
            </View>
          </View>
        </Modal>
      </View>)
  }
}

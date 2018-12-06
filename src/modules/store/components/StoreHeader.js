import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  ActivityIndicator
} from 'react-native'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import HeaderSearchProduct from '../../../common/components/elements/HeaderSearchProduct';
import { Button, Rating, Icon } from 'react-native-elements'
import StoreInformation from '../containers/StoreInformation';
import { TEST_URL } from '../../../common/models'
import axios from 'axios'
import CategoryList from '../containers/CategoryList';
import ProductList from '../containers/ProductList';
import { SCREENS } from '../../../common/screens'
import HeaderTitle from '../../../common/components/elements/HeaderTitle';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}

export default class StoreHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cover: {},
      index: 0,
      categories: null,
      orders: [],
      routes: [
        { key: 'information', title: 'Thông tin' },
        { key: 'categories', title: 'Danh mục' },
        { key: 'products', title: 'Đồ uống' }
      ]
    }
    this.renderScene = this.renderScene.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.handleIndexChange = this.handleIndexChange.bind(this)
  }

  componentDidMount() {
    const { getStoreInformation, id, user } = this.props
    id && getStoreInformation(id)

    const filter = {
      "include":{
        "relation":"categories",
        "scope":{
          "include":{
            "relation":"products",
            "scope":{
              "fields":"productName"
            }
          }
        }
      }
    }

    // const url = `${TEST_URL}/api/categories?filter[where][shopId]=${id}`
    const url = `${TEST_URL}/api/shops/${id}?filter=${JSON.stringify(filter)}`

    this.setState({ loading: true }, () => {
      axios({
        url,
        timeout: 5000
      })
        .then(response => {
          const privateCategories = response.data.categories
          const orders = response.data.orders
          this.setState({
            categories: privateCategories,
            loading: false,
            orders
          })
        })
        .catch(e => {
          this.setState({ categories: null, loading: false })
        })
    })
  }

  componentWillMount(){
    const { getStoreInformation, id } = this.props
    // id && getStoreInformation(id)
  }

  componentWillUpdate(){ 
    const { getStoreInformation, id } = this.props
    // id && getStoreInformation(id)
  }

  bookTable = () => {
    const { navigation, detail, token, id, user } = this.props
    const { orders } = this.state
    if (!token) {
      navigation.navigate(SCREENS.AuthenticatePage)
      return
    }
    if (detail) {
      // if(orders.length > 0){
      //   navigation.navigate(SCREENS.BookConfirmPage, { memberId: user.id, shopId: id })
      // }
      // else{
        navigation.navigate(SCREENS.BookDetailPage, { shop: detail, memberId: user.id })
      // }
    }
  }

  handleIndexChange(index) {
    this.setState({ index })
  }

  renderLabel = (scene) => {
    const label = scene.route.title
    return <Text style={{ color: scene.index === this.state.index ? '#2089E1' : '#000' }}>{label}</Text>
  }

  renderHeader(props) {
    return <TabBar
      {...props}
      style={{ backgroundColor: '#ffffff' }}
      // labelStyle={{ fontWeight: 'bold', fontSize: 10 }}
      indicatorStyle={{ backgroundColor: 'red' }}
      renderLabel={this.renderLabel}
    />
  }

  renderScene({ route }) {
    const { detail, shippingTypes, paymentTypes, privateCategories, navigation, getStoreInformation } = this.props
    const { categories } = this.state
    switch (route.key) {
      case 'information':
        return <StoreInformation detail={detail} shippingTypes={shippingTypes} 
        paymentTypes={paymentTypes} navigation={navigation} getStoreInformation={getStoreInformation} />
      case 'categories':
        return <CategoryList categories={categories} />
      case 'products':
        return <ProductList detail={detail} />
      default:
        return null
    }
  }

  ratingCompleted(rating) {
    
  }

  render() {
    const { detail, navigation } = this.props
    const cover = detail && detail.shopFeaturedImages ? detail.shopFeaturedImages[0] : null
    const logo = detail && detail.shopLogo ? detail.shopLogo : null
    // const cover = ''
    // const logo = ''
    return (
      <View style={{ flex: 1 }}>
        {
          detail
            ? <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
              {/* <HeaderSearchProduct /> */}
              <HeaderTitle
                canBack={false} onBack={() => navigation.goBack()}
                title= {detail.shopName.toUpperCase()}
                rightIcon={(<Text
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: '#fff',
                    fontSize: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#fff'
                  }}
                  onPress={this.bookTable}
                >
                  Đặt chỗ
                </Text>)}
              />
              <Animated.Image
                source={
                  !cover
                    ? require('../../../assets/banner/Banner4.jpg')
                    : { uri: cover }
                }
                style={{ width: '100%', height: 150 }}
                resizeMode='cover'
              />
              <View style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 12,
                position: 'absolute',
                zIndex: 2,
                top: 120,
                left: 5
              }}>
                <View style={{ width: 60 }}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    // source={{
                    //   uri: !logo || !logo.fullUrl
                    //     ? 'https://image.flaticon.com/icons/png/128/1114/1114350.png'
                    //     : logo.fullUrl
                    // }}
                    source={
                      !logo
                        ? require('../../../assets/logo/shoplogo.png')
                        : { uri: logo }
                    }
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
                    {detail.shopName}
                  </Text>
                  {/* <Text style={{ color: '#2089E1' }}>
                    Online
                  </Text> */}
                  {/* <View style={{ flexDirection: 'row' }}> */}
                  {/* <Rating
                      fractions={1}
                      startingValue={detail.totalRatingValue}
                      imageSize={18}
                      readonly
                      showRating={false}
                      type='custom'
                      ratingImage={require('../../../assets/images/star.png')}
                      ratingBackgroundColor='transparent'
                      style={{ paddingVertical: 10, backgroundColor: 'transparent' }}
                    />
                    <Text style={{ paddingLeft: 5, paddingVertical: 10, color: '#003366' }}>
                      ({detail.numberOfFollowers || '0'})
                    </Text> */}
                  <Text style={{ flex: 1, color: '#00FF00' }}>
                    Online
                    </Text>
                  {/* <View style={{ paddingLeft: 10 }}>
                      <Button
                        backgroundColor='transparent'
                        color='red'
                        borderRadius={8}
                        onPress={this.onChatWithShop}
                        fontSize={16}
                        containerViewStyle={{ width: 100, height: 25 }}
                        buttonStyle={{ borderColor: '#2089E1', borderWidth: 0 }}
                        title='Chat now'
                      />
                    </View> */}
                  {/* <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        color: '#b30000',
                        fontSize: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#2089E1'
                      }}
                      onPress={this.onChatWithShop}
                    >
                      Chat now
                    </Text>
                  </View> */}
                </View>
              </View>
              <TabViewAnimated
                style={{ flex: 1 }}
                navigationState={this.state}
                renderScene={this.renderScene}
                renderHeader={this.renderHeader}
                onIndexChange={this.handleIndexChange}
                initialLayout={initialLayout}
              />
            </View>
            :
            <View style={{
              justifyContent: 'center',
              padding: 10,
              alignItems: 'center',
              alignContent: 'center',
              height: '100%',
              flex: 1
            }}>
              <ActivityIndicator size="large" color="#6F4E37" />
            </View>
        }
      </View>
    )
  }
}

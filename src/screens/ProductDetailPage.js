import React, { Component } from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native'
import axios from 'axios'
import { BASE_URL } from '../common/models'
import Header from '../common/components/elements/HeaderSearchProduct'
import DefaultPage from '../common/hocs/defaultPage'
import ProductImages from '../modules/productDetails/components/ProductImages'
import ProductTitle from '../modules/productDetails/containers/ProductTitle'
import ProductPrice from '../modules/productDetails/containers/ProductPrice'
import ProductDetail from '../modules/productDetails/components/ProductDetail'
import ShopInfo from '../modules/productDetails/containers/ShopInfo'
import ProductRatingAndComment from '../modules/productDetails/components/ProductRatingAndComment'
import ShopProduct from '../modules/productDetails/containers/ShopProduct'
import ProductSubMenu from '../modules/productDetails/containers/ProductSubMenu'
import AddToCartPopup from '../modules/productDetails/containers/AddToCartPopup'
import ProductReview from '../modules/productDetails/containers/ProductReview'
import WriteReview from '../modules/productDetails/containers/WriteReview'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import { getActivePrices } from '../common/utils/productUtils'

const tempProductPrices = [
  {
    'fromDate': '2018-05-15T00:59:05.048Z',
    'toDate': '2018-05-15T00:59:05.048Z',
    'minQuantity': 0,
    'maxQuantity': 0,
    'offPercent': 0,
    'type': 0,
    'status': 0,
    'cashValue': 100,
    'electricValue': 0.5,
    'isInFlashSales': false,
    'id': 0,
    'productPriceId': 0,
    'productId': 0,
    'currencyUnitId': 0,
    'cashUnitId': 1,
    'electricUnitId': 2
  },
  {
    'fromDate': '2018-05-15T00:59:05.048Z',
    'toDate': '2018-05-15T00:59:05.048Z',
    'minQuantity': 0,
    'maxQuantity': 0,
    'offPercent': 0,
    'type': 0,
    'status': 0,
    'cashValue': 300,
    'electricValue': 0.1,
    'isInFlashSales': false,
    'id': 0,
    'productPriceId': 0,
    'productId': 0,
    'currencyUnitId': 0,
    'cashUnitId': 1,
    'electricUnitId': 2
  }
]

const tempProductVariations = [
  {
    'name': 'Red & 2kg',
    'quantity': 100,
    'id': 0,
    'productId': 0
  },
  {
    'name': 'Blue & 3kg',
    'quantity': 20,
    'id': 0,
    'productId': 0
  }
]

const tempProduct = {
  "name": "string",
  "description": "string",
  "weight": "string",
  "packageLength": "string",
  "packageHeight": "string",
  "packageWidth": "string",
  "createdAt": "2018-04-28T04:18:06.850Z",
  "updatedAt": "2018-04-28T04:18:06.850Z",
  "status": 1,
  "type": 0,
  "monthlyView": 2,
  "totalView": 1,
  "totalRatingValue": 3,
  "totalUserRating": 2,
  "totalUserFavorite": 3,
  "isNew": true,
  "id": 6,
  "shopId": 1,
  "publicCategoryId": 1,
  "privateCategoryId": null,
  "userId": 7,
  productPrices: tempProductPrices,
  productVariations: tempProductVariations
}

const shopShippingTypes = [
  {
    "description": "ABC",
    "id": 1,
    "shopId": 4,
    "shippingTypeId": 1
  },
  {
    "description": "DEF",
    "id": 2,
    "shopId": 4,
    "shippingTypeId": 2
  }
]

const shopPaymentMethods = [
  {
    "accountName": null,
    "accountNumber": null,
    "swiffCode": null,
    "bankName": null,
    "branchName": null,
    "QRCodeImage": null,
    "paymentAddress": null,
    "note": null,
    "status": null,
    "id": 1,
    "userId": null,
    "shopId": 4,
    "paymentTypeId": 1 // COD
  },
  {
    "accountName": "TANGTRET",
    "accountNumber": "0123456789",
    "swiffCode": "TANGTRET",
    "bankName": "TANGTRET",
    "branchName": "TANGTRET",
    "QRCodeImage": null,
    "paymentAddress": null,
    "note": null,
    "status": null,
    "id": 2,
    "userId": null,
    "shopId": 4,
    "paymentTypeId": 2 // BANK TRANSFER
  },
  {
    "accountName": null,
    "accountNumber": null,
    "swiffCode": null,
    "bankName": null,
    "branchName": null,
    "QRCodeImage": "string",
    "paymentAddress": "0123456789",
    "note": null,
    "status": null,
    "id": 3,
    "userId": null,
    "shopId": 4,
    "paymentTypeId": 3 // BTC
  }
]

const tempShopInfo = {
  "name": "The Si's shop",
  "email": "ttsi2@yopmail.com",
  "slogan": "",
  "description": "",
  "website": "",
  "facebookUrl": "",
  "establishedYear": null,
  "registeredDate": null,
  "workingTime": null,
  "numberOfFollowers": null,
  "numberOfProducts": null,
  "responseRate": null,
  "prepareTime": null,
  "totalRating": null,
  "status": 1,
  "type": null,
  "id": 3,
  "userId": 3,
  "shopShippingTypes": shopShippingTypes,
  "shopPaymentMethods": shopPaymentMethods
}

export default class ProductDetailPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      totalProductAdded: 1,
      showAddToCart: false,
      variantSelected: null,
      priceSelected: null,
      thisProduct: null,
      shopInfo: null,
      loading: true,
      userPayments: [],
      showWriteReview: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    const productItem = navigation.getParam('productItem', {})
    const filter = {
      'include': [
        {
          'shop': [
            'shopShippingTypes',
            {
              'relation': 'shopPaymentMethods',
              'scope': {
                'where': {
                  'status': 'active'
                },
                'include': 'paymentType'
              }
            },
            'images'
          ]
        },
        'publicCategory',
        {
          'relation': 'productVariations',
          'scope': {
            'where': {
              'status': 1
            }
          }
        },
        {
          'relation': 'productPrices',
          'scope': {
            'where': {
              'status': 1
            },
            'include': [
              'cashUnit',
              'electricUnit',
              'promotionPrice'
            ]
          }
        },
        'countries',
        'images',
        {
          'relation': 'productRatings',
          'scope': {
            'where': {
              'status': 1
            },
            'include': { 'user': 'images' },
            'order': 'createdAt DESC'
          }
        }
      ]
    }
    const url = `${BASE_URL}/api/products/${productItem.id}?filter=${JSON.stringify(filter)}`

    this.setState({ loading: true }, () => {
      axios({
        url,
        timeout: 5000
      })
        .then(response => {
          const thisProduct = response.data
          const priceSelected = thisProduct.productPrices.length > 0
            ? getActivePrices(thisProduct.productPrices)[0].id
            : null
          let variantSelected = null
          if (thisProduct.productVariations.length > 0) {
            thisProduct.productVariations.forEach(variant => {
              if (variant.quantity > 0 && !variantSelected) {
                variantSelected = variant
              }
            })
          }
          this.setState({
            thisProduct,
            priceSelected,
            variantSelected,
            shopInfo: thisProduct.shop,
            loading: false
          })
        })
        .catch(e => {
          this.setState({ thisProduct: null, shopInfo: null, loading: false })
        })
    })
  }

  onChangeProductAdded = (totalProductAdded) => {
    const { variantSelected } = this.state
    const quantity = totalProductAdded < 1
      ? 1
      : totalProductAdded > variantSelected.quantity
        ? variantSelected.quantity
        : totalProductAdded
    this.setState({ totalProductAdded: quantity })
  }

  onSelectProductVariant = (variant) => {
    const { totalProductAdded } = this.state
    const newTotalProductAdded = Math.min(parseInt(totalProductAdded, 10), parseInt(variant.quantity, 10))

    this.setState({
      variantSelected: variant,
      totalProductAdded: newTotalProductAdded
    })
  }

  onSelectProductPrice = (index) => {
    this.setState({ priceSelected: index })
  }

  onToggleAddToCart = () => {
    if (!this.checkProductExist()) {
      return
    }
    const { showAddToCart } = this.state
    this.setState({ showAddToCart: !showAddToCart })
  }

  onToggleWriteReview = () => {
    if (!this.checkProductExist()) {
      return
    }
    const { showWriteReview } = this.state
    this.setState({ showWriteReview: !showWriteReview })
  }

  checkProductExist = () => {
    const { thisProduct } = this.state
    if (thisProduct && thisProduct.status !== 1) {
      Alert.alert(
        'Thông Báo',
        'Sản phẩm không tồn tại',
        [
          { text: 'OK', onPress: () => { } },
        ],
        { cancelable: false }
      )
      return false
    }
    return true
  }

  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render() {
    const { navigation } = this.props
    const {
      totalProductAdded,
      variantSelected,
      priceSelected,
      showAddToCart,
      showWriteReview,
      thisProduct,
      shopInfo,
      loading
    } = this.state

    this.checkProductExist()

    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >

        {
          !loading && thisProduct ?
            <View style={{ width: '100%', flex: 1 }}>
              <HeaderTitle
                onBack={this.onBack}
                title={thisProduct.name} />

              <View style={{ flex: 1 }}>
                <ScrollView
                  style={{ paddingBottom: 100 }}
                >
                  <ProductImages productItem={thisProduct} />
                  <ProductTitle productItem={thisProduct} />
                  <ProductPrice
                    productItem={thisProduct}
                    totalProductAdded={totalProductAdded}
                    onChangeProductAdded={this.onChangeProductAdded}
                  />
                  <ProductDetail productItem={thisProduct} />
                  {shopInfo !== null && <ShopInfo shopInfo={shopInfo} navigation={navigation} />}
                  <ProductReview
                    onToggleWriteReview={this.onToggleWriteReview}
                  />
                  <ProductRatingAndComment
                    ratings={thisProduct.productRatings}
                    totalRatingValue={thisProduct.totalRatingValue}
                    totalUserRating={thisProduct.totalUserRating}
                    newestRatings={thisProduct.productRatings && thisProduct.productRatings.slice(0, 2)}
                    productId={thisProduct && thisProduct.id}
                    images={thisProduct.images}
                    productName={thisProduct.name}
                  />
                  {shopInfo && <ShopProduct shopInfo={shopInfo} />}
                </ScrollView>

                <ProductSubMenu
                  onToggleAddToCart={this.onToggleAddToCart}
                  navigation={navigation}
                  shopInfo={shopInfo}
                />

                <Modal
                  animationType='slide'
                  transparent={true}
                  visible={showAddToCart}
                >
                  <AddToCartPopup
                    totalProductAdded={totalProductAdded}
                    onChangeProductAdded={this.onChangeProductAdded}
                    productItem={thisProduct}
                    variantSelected={variantSelected}
                    priceSelected={priceSelected}
                    shopInfo={shopInfo}
                    onToggleAddToCart={this.onToggleAddToCart}
                    onSelectProductVariant={this.onSelectProductVariant}
                    onSelectProductPrice={this.onSelectProductPrice}
                  />
                </Modal>

                <Modal
                  animationType='slide'
                  transparent={true}
                  visible={showWriteReview}
                >
                  <WriteReview
                    productId={thisProduct && thisProduct.id}
                    onBack={this.onToggleWriteReview}
                    images={thisProduct.images}
                    productName={thisProduct.name}
                  />
                </Modal>
              </View>
            </View> :
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
      </DefaultPage>
    )
  }
}


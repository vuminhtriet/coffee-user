import moment from 'moment'
import React, { Component, PureComponent } from 'react'
import {
  View,
  Text,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ListView,
  Platform,
  Alert
} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import { Dropdown } from 'react-native-material-dropdown'
import {
  FormInput,
  ListItem,
  Card,
  Icon,
  Badge,
  Button,
  FormValidationMessage,
  FormLabel
} from 'react-native-elements'
import MultiSelect from 'react-native-multiple-select'
import ProductPriceEdit from '../containers/ProductPriceEdit'
import ProductPrice from '../containers/ProductPrice'
import CategoryList from '../containers/CategoryList'
const ImagePicker = require('react-native-image-picker')
const { height } = Dimensions.get('window')

const options = {
  title: 'Upload your product image',
  storageOptions: {
    skipBackup: true,
    noData: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true
  }
}
export default class ProductEdit extends Component {
  constructor (props) {
    super(props)
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const { publicCategories, privateCategories, product, units } = this.props
    const salePrices = {}
    this.state = {
      disabled: false,
      addPrice: false,
      product: JSON.parse(JSON.stringify(product)),
      images: product.images,
      addVariant: false,
      addCategories: false,
      variant: {},
      name: product.name,
      description: product.description,
      weight: product.weight,
      isNew: product.isNew ? 1 : 0,
      privateCategoryId: product.privateCategoryId && privateCategories && privateCategories
        .find(item => item.id === product.privateCategoryId),
      publicCategoryId: product.publicCategoryId && publicCategories && publicCategories
        .find(item => item.id === product.publicCategoryId),
      productVariants: product.productVariations.filter(item => item.status !== -1) || [],
      productCountries: product.productShippingCountries ? product.productShippingCountries.map(item => item.countryId) : [],
      // dataSource: ds.cloneWithRows(props.countries),
      editPrice: false,
      price: {},
      errors: {},
      enableScrollViewScroll: true,
      productPrices: product.productPrices ? product.productPrices
        .filter(item => {
          if (item.status === -1) {
            return false
          }
          if (item.fromDate && item.toDate && item.productPriceId) {
            salePrices[item.productPriceId] = {
              ...item
            }
            return false
          }
          return true
        }).map(item => {
          const cashUnit = units.find(cash => cash.id === item.cashUnitId)
          const cryptoUnit = units.find(crypto => crypto.id === item.electricUnitId)
          const cashOriginUnit = salePrices[item.id] && units.find(cash => cash.id === salePrices[item.id].cashUnitId)
          const cryptoOriginUnit = salePrices[item.id] && units.find(crypto => crypto.id === salePrices[item.id].electricUnitId)
          const flashSale = salePrices[item.id] &&
            moment(salePrices[item.id].toDate).isAfter(moment())
          return {
            id: item.id,
            offPercent: (salePrices[item.id] && salePrices[item.id].offPercent) || undefined,
            saleId: (salePrices[item.id] && salePrices[item.id].id) || undefined,
            flashSale: flashSale,
            flashSaleDate: flashSale && moment(salePrices[item.id].toDate).format('LLL'),
            origin: {
              cash: item.cashValue ? {
                value: item.cashValue,
                unit: cashUnit
              } : null,
              crypto: item.electricValue ? {
                value: item.electricValue,
                unit: cryptoUnit
              } : null
            },
            sales: flashSale && salePrices[item.id] ? {
              cash: salePrices[item.id].cashValue ? {
                value: salePrices[item.id].cashValue,
                unit: cashOriginUnit
              } : null,
              crypto: salePrices[item.id].electricValue && salePrices[item.id] ? {
                value: salePrices[item.id].electricValue,
                unit: cryptoOriginUnit
              } : null
            } : null
          }
        }) : []
    }
    this.submit = this.submit.bind(this)
    this.onChoose = this.onChoose.bind(this)
    this.addVariant = this.addVariant.bind(this)
    this.onAddPrice = this.onAddPrice.bind(this)
    this.addCountry = this.addCountry.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.onEditPrice = this.onEditPrice.bind(this)
    this.editVariant = this.editVariant.bind(this)
    this.onChooseCover = this.onChooseCover.bind(this)
    this.addPriceModal = this.addPriceModal.bind(this)
    this.addNewVariant = this.addNewVariant.bind(this)
    this.renderCountry = this.renderCountry.bind(this)
    this.removeCountry = this.removeCountry.bind(this)
    this.toggleProduct = this.toggleProduct.bind(this)
    this.editPriceModal = this.editPriceModal.bind(this)
    this.selectCategories = this.selectCategories.bind(this)
    this.addCategoryModal = this.addCategoryModal.bind(this)
    this.renderCountryKey = this.renderCountryKey.bind(this)
    this.onChangeProductName = this.onChangeProductName.bind(this)
    this.onChangeProductDescription = this.onChangeProductDescription.bind(this)
  }
  renderCountry (item) {
    return (
      <Badge
        onPress={() => this.addCountry(item.id)}
        key={item.id}
        containerStyle={{
          width: undefined,
          height: 40,
          backgroundColor: '#E0E0E0',
          paddingVertical: 10,
          marginRight: 10,
          marginVertical: 5
        }}
      >
        <Text>{item.name}</Text>
      </Badge>
    )
  }
  async toggleProduct () {
    const { shop, token, toggleProduct, getShopProducts, navigation } = this.props
    const { product } = this.state
    await toggleProduct(token, product)
    getShopProducts(shop)
    navigation.goBack()
  }
  renderCountryKey (item) {
    return item.id
  }
  async submit () {
    this.setState({ disabled: true })
    const {
      product,
      images,
      name,
      weight,
      isNew,
      privateCategoryId,
      publicCategoryId,
      description,
      productCountries,
      productPrices,
      productVariants
    } = this.state
    const {
      getShopProducts,
      navigation,
      user,
      shop,
      token,
      editProduct,
      countries = [] } = this.props
    const errors = []
    if (!productPrices || !productPrices.length) {
      errors.push('* Product price required.')
    }
    if (!publicCategoryId && !privateCategoryId) {
      errors.push('* Product category required.')
    }
    if (!productVariants || !productVariants.length) {
      errors.push('* Product variants required.')
    }
    if (weight && !parseFloat(weight)) {
      errors.push('* Weight invalid format.')
    }
    const total = productVariants
      ? productVariants.reduce((all, item) => {
        return all + item.quantity
      }, 0)
      : 0
    if (total < 0) {
      errors.push('* Product quantity much large than 0.')
    }
    if (errors.length) {
      return this.setState({
        errors,
        disabled: false
      })
    }
    // TODO: Handle images
    const editImages = []
    let deleteImages = product.images.filter(item => {
      const image = images.find(image => image.id === item.id)
      if (image) {
        editImages.push({
          ...item,
          type: image.type
        })
        return false
      }
      return true
    })
    const newImages = images.filter(item => !item.id)
    // TODO: Handle variants
    const editVariants = []
    const deleteVariants = product.productVariations.filter(item => {
      const exist = productVariants.find(variant => variant.id === item.id)
      if (exist) {
        editVariants.push({
          ...item,
          quantity: item.quantity,
          originalQuantity: exist.originalQuantity
        })
        return false
      }
      return true
    }).map(item => ({ ...item, status: -1 }))
    const newVariants = productVariants.filter(item => !item.id)
    // TODO: Handle edit delete and new price
    // let deletedPrices = []
    let editPrices = product.productPrices.map(item => {
      if (item.status === -1) {
        return undefined
      }
      const exist = item.id && productPrices.find(price =>
        price.id === item.id || price.saleId === item.id)
      if (!exist) {
        return { ...item, status: -1 }
      }
      return exist
    }).filter(item => item)
    // editPrices = productPrices
    const newPrices = productPrices.filter(item => !item.id)
    // console.log('editPrices', editPrices)
    // console.log('deletedPrices', deletedPrices)
    // console.log('newPrices', newPrices)
    await editProduct(token,
      product, {
        name,
        description,
        publicCategoryId,
        privateCategoryId,
        // productPrices,
        newPrices,
        editPrices,
        // deletedPrices,
        // productVariants,
        deleteVariants,
        editVariants,
        newVariants,
        weight,
        isNew,
        productCountries: product.productShippingCountries.map(item => {
          const country = productCountries.some(id => id === item.countryId)
          if (!country) {
            return {
              id: item.id,
              status: -1
            }
          }
          return {
            id: item.id || undefined,
            name: item.name,
            code: item.code,
            countryId: item.id,
            productId: product.id,
            status: item.status
          }
        }),
        newCountries: productCountries.map(item => {
          const exist = product.productShippingCountries.some(country => {
            return country.countryId === item
          })
          if (!exist) {
            return {
              code: item,
              countryId: item,
              productId: product.id,
              status: 1
            }
          }
          return undefined
        }).filter(item => item)
      }, newImages, deleteImages, editImages, user, shop)
    getShopProducts(shop)
    // this.setState({ disabled: false })
    navigation.goBack()
  }
  addPriceModal () {
    const { addPrice } = this.state
    this.setState({
      addPrice: !addPrice
    })
  }
  removeCountry (id) {
    let { productCountries } = this.state
    const index = productCountries.findIndex(item => item === id)
    productCountries.splice(index, 1)
    this.setState({
      productCountries: [
        ...productCountries
      ],
      errors: []
    })
  }
  addCountry (ids) {
    const { countries } = this.props
    const newId = ids[ids.length - 1]
    if (countries.find(item => item.id === newId)) {
      this.setState({
        productCountries: [
          ...ids
        ],
        errors: []
      })
    } else {
      return false
    }
  }
  editPriceModal () {
    const { editPrice } = this.state
    this.setState({
      editPrice: !editPrice
    })
  }
  addVariant (variant = undefined) {
    const { addVariant } = this.state
    this.setState({
      variant: addVariant === false
        ? variant : {},
      addVariant: !addVariant
    })
  }
  addCategoryModal () {
    const { addCategories } = this.state
    this.setState({
      addCategories: !addCategories
    })
  }

  removeImage (index) {
    const images = [...this.state.images]
    images.splice(index, 1)
    this.setState({ images })
  }

  editVariant () {
    let { variant, productVariants } = this.state
    if (!variant.id ||
      !variant.name ||
      !variant.originalQuantity ||
      !parseInt(variant.originalQuantity) ||
      parseInt(variant.originalQuantity) < 0
    ) {
      return false
    }
    if (parseInt(variant.originalQuantity) - parseInt(variant.onhandQuantity) < 0) {
      Alert.alert(
        'Error',
        'You cannot update the quantity if it is lower than the quantity onhand. Please delete your incomplete orders to release the quantity onhand if any.'
      )
      return false
    } else {
      const variants = productVariants.map(item => {
        if (item.id === variant.id) {
          return {
            ...item,
            originalQuantity: parseInt(variant.originalQuantity)
          }
        }
        return item
      })
      this.setState({
        productVariants: [
          ...variants
        ],
        errors: [],
        variant: {},
        addVariant: false
      })
    }
  }

  addNewVariant () {
    let { variant, productVariants } = this.state
    if (!variant.name ||
      !variant.quantity ||
      !parseInt(variant.quantity) ||
      parseInt(variant.quantity) < 0
    ) {
      return false
    }
    productVariants.push({
      name: variant.name,
      quantity: parseInt(variant.quantity),
      originalQuantity: parseInt(variant.quantity),
      onhandQuantity: 0
    })
    this.setState({
      productVariants: [
        ...productVariants
      ],
      errors: [],
      variant: {},
      addVariant: false
    })
  }
  selectCategories (item) {
    if (!item || !item.id) {
      return this.setState({
        addCategories: false
      })
    }
    this.setState({
      [item.shopId ? 'privateCategoryId' : 'publicCategoryId']: item,
      addCategories: false,
      errors: []
    })
  }
  onChooseCover (index) {
    const images = this.state.images.map((item, i) => {
      if (i === parseInt(index)) {
        return { ...item, type: 2 }
      }
      return { ...item, type: 3 }
    })
    this.setState({ images })
  }
  onChoose () {
    const { images } = this.state
    ImagePicker.showImagePicker(options, (response) => {
      let fileName = null
      let fileUri = null
      let fileData = null
      let fileOriginUri = null
      if (response.didCancel) {
        return false
      } else if (response.error) {
        return false
      } else if (response.customButton) {
        return false
      } else {
        fileName = response.fileName
        fileUri = response.uri
        fileOriginUri = response.origURL
        fileData = response.data
      }
      if (!fileUri) {
        return false
      }
      ImageResizer.createResizedImage(fileUri, 720, 1280, 'JPEG', 60)
        .then((response) => {
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
          this.setState({
            images: [
              ...images,
              {
                type: 3,
                fileName,
                fileUri,
                fileData,
                fileOriginUri,
                resized: response
              }
            ]
          })
        }).catch(() => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
          this.setState({
            images: [
              ...images,
              {
                type: 3,
                fileName,
                fileUri,
                fileData,
                fileOriginUri,
                resized: undefined
              }
            ]
          })
        })
    })
  }
  onAddPrice (newPrice) {
    let { productPrices } = this.state
    // if (productPrices.length > 2) {
    //   return false
    // }
    productPrices.push(newPrice)
    this.setState({
      addPrice: false,
      productPrices: [
        ...productPrices
      ],
      errors: []
    })
  }

  onEditPrice (newPrice) {
    let { productPrices } = this.state
    // if (productPrices.length > 2) {
    //   return false
    // }
    this.setState({
      editPrice: false,
      productPrices: [
        ...productPrices.map(item => {
          if (item.id === newPrice.id) {
            return {
              ...newPrice
            }
          }
          return {
            ...item
          }
        })
      ],
      errors: []
    })
  }

  onChangeProductName (text) {
    this.setState({
      name: text
    })
  }
  onChangeProductDescription (text) {
    this.setState({
      description: text
    })
  }

  removeVariant (item, index) {
    let { productVariants } = this.state
    const variant = productVariants[index]
    if (variant) {
      if (variant.onhandQuantity > 0) {
        Alert.alert(
          'Error',
          'You cannot delete variant if the quantity onhand is larger than 0. Please delete your incomplete orders to release the quantity onhand if any.'
        )
        return false
      } else {
        productVariants.splice(index, 1)
        this.setState({
          productVariants: [
            ...productVariants
          ],
          variant: {},
          addVariant: false
        })
      }
    } else {
      return false
    }
  }

  removePrice (item, index) {
    let { productPrices } = this.state
    productPrices.splice(index, 1)
    this.setState({
      addPrice: false,
      productPrices: [
        ...productPrices
      ]
    })
  }

  render () {
    const {
      product,
      errors,
      editPrice,
      price,
      name,
      weight,
      isNew,
      description,
      addVariant,
      addPrice,
      productCountries,
      images,
      variant,
      // dataSource,
      productPrices,
      productVariants,
      privateCategoryId,
      publicCategoryId,
      // enableScrollViewScroll,
      addCategories
    } = this.state
    const { countries = [] } = this.props
    return (
      <ScrollView>
        <View
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: true })
          }}
          style={{
            flexDirection: 'column'
          }}
        >
          <ScrollView
            horizontal
            style={{
              width: '100%',
              height: 100,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 20,
              paddingVertical: 10
            }}>
            {images && images.map((image, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: 80,
                    height: 80,
                    marginHorizontal: 10,
                    backgroundColor: '#000'
                  }}>
                  <Icon
                    containerStyle={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      zIndex: 2
                    }}
                    onPress={() => this.removeImage(index)}
                    name='close'
                    color='#E4521B'
                  />
                  <TouchableOpacity
                    style={{
                      zIndex: 1
                    }}
                    onPress={() => this.onChooseCover(index)}
                  >
                    <Image
                      resizeMode='contain'
                      style={{ width: 80, height: 80 }}
                      source={{ uri: image.id ? image.fullUrl : image.fileUri }}
                    />
                    {image.type === 2 && (
                      <View
                        style={{
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          position: 'absolute',
                          height: 20
                        }}
                      >
                        <Icon
                          name='check'
                          color='green'
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              )
            })}
            {Platform.OS === 'ios' ? <View
              style={{
                width: 80,
                height: 80,
                borderWidth: 2,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#EE9468'
              }}>
              <TouchableOpacity
                onPress={this.onChoose}
              >
                <Text style={{ color: '#EE9468' }}>
                  Upload images/videos
                </Text>
              </TouchableOpacity>
            </View> : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <Icon
                  name='add-a-photo'
                  size={40}
                  onPress={this.onChoose}
                  containerStyle={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    position: 'absolute',
                    zIndex: 2,
                    top: 5,
                    right: 5
                  }}
                />
              </View>
            )}
          </ScrollView>
          <FormValidationMessage containerStyle={{ paddingBottom: 10, backgroundColor: '#FFFFFF' }}>
            * Touch an image you want to choose it as a cover picture
          </FormValidationMessage>
          <Card containerStyle={{
            margin: 0,
            marginTop: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: undefined,
            height: undefined
          }}>
            <FormInput
              value={name}
              containerStyle={{ margin: 0, padding: 0 }}
              style={{ margin: 0, padding: 0 }}
              inputStyle={{ margin: 0, padding: 0 }}
              placeholder='Product name'
              onChangeText={this.onChangeProductName}
            />
            <View style={{ width: undefined }}>
              <FormInput
                value={description}
                multiline
                numberOfLines={5}
                style={{
                  height: undefined
                }}
                inputStyle={{ width: '100%' }}
                containerStyle={{ minHeight: 60, marginVertical: 0, padding: 0 }}
                placeholder='Product description'
                onChangeText={this.onChangeProductDescription}
              />
            </View>
          </Card>
          <ListItem
            containerStyle={{ backgroundColor: '#FFFFFF' }}
            leftIcon={{ name: 'format-align-left' }}
            title='Category'
            onPress={this.addCategoryModal}
          />
          {privateCategoryId && (<ListItem
            containerStyle={{ backgroundColor: '#FFFFFF' }}
            key={`privateCategoryId_${privateCategoryId.id}`}
            title={`${privateCategoryId.name}`}
            rightIcon={{ name: 'delete', color: '#E44C4C' }}
            onPressRightIcon={() => {
              this.setState({
                privateCategoryId: null
              })
            }}
          />)}
          {publicCategoryId && (<ListItem
            containerStyle={{ backgroundColor: '#FFFFFF' }}
            key={`publicCategoryId_${publicCategoryId.id}`}
            title={`${publicCategoryId.name}`}
            rightIcon={{ name: 'delete', color: '#E44C4C' }}
            onPressRightIcon={() => this.setState({
              publicCategoryId: null
            })}
          />)}
          <Card containerStyle={{
            margin: 0,
            marginTop: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: undefined,
            height: undefined
          }}>
            <Text
              style={{ color: '#6F4E37', paddingVertical: 10, fontWeight: 'bold' }}>
              Price setting
            </Text>
            <Icon
              name='add'
              onPress={this.addPriceModal}
              color='#E44C4C'
              containerStyle={{ position: 'absolute', right: 0, top: 0 }} />
            <View style={{ flexDirection: 'column' }}>
              {productPrices && productPrices.map((price, index) => {
                const { flashSale, origin, sales } = price
                let priceLabel = flashSale ? sales : origin
                if (!priceLabel.cash &&
                  !priceLabel.crypto) {
                  return null
                }
                let priceString = ''
                priceString = priceLabel.cash && priceLabel.cash.unit
                  ? `${priceLabel.cash.value} ${priceLabel.cash.unit.code}` : ''
                priceString += priceString.length && origin.crypto
                  ? ' + ' : ''
                priceString += priceLabel.crypto && priceLabel.crypto.unit
                  ? `${priceLabel.crypto.value} ${priceLabel.crypto.unit.code}` : ''
                const lastPrice = origin
                let lastPriceLabel = ''
                if (flashSale) {
                  lastPriceLabel = lastPrice.cash && lastPrice.cash.unit
                    ? `${lastPrice.cash.value} ${lastPrice.cash.unit.code}` : ''
                  lastPriceLabel += lastPriceLabel.length && origin.crypto
                    ? ' + ' : ''
                  lastPriceLabel += lastPrice.crypto && lastPrice.crypto.unit
                    ? `${lastPrice.crypto.value} ${lastPrice.crypto.unit.code}` : ''
                }
                return (
                  <ListItem
                    key={index}
                    title={`Option ${index + 1}`}
                    rightTitle={priceString ? `${priceString}` : ''}
                    subtitle={lastPriceLabel ? `${lastPriceLabel}` : ''}
                    subtitleStyle={{ textDecorationLine: 'line-through' }}
                    onPress={() => this.setState({
                      price,
                      editPrice: true
                    })}
                    rightTitleStyle={{ color: '#000' }}
                    rightIcon={{ name: 'delete', color: '#E44C4C' }}
                    onPressRightIcon={() => this.removePrice(price, index)}
                  />
                )
              })}
            </View>
          </Card>
          <Card containerStyle={{
            margin: 0,
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: undefined,
            height: undefined
          }}>
            <Text
              style={{ color: '#6F4E37', paddingVertical: 10, fontWeight: 'bold' }}>
              Variant & quantity
            </Text>
            <Icon
              name='add'
              onPress={this.addVariant}
              color='#E44C4C'
              containerStyle={{ position: 'absolute', right: 0, top: 0 }} />
            <View style={{ flexDirection: 'column' }}>
              {productVariants && productVariants.map((item, index) => {
                return (<ListItem
                  key={index}
                  title={item.name}
                  rightTitle={`${item.quantity}`}
                  rightTitleStyle={{ color: '#000' }}
                  subtitle={`Original: ${item.originalQuantity}`}
                  onPress={() => this.addVariant(item)}
                  rightIcon={{ name: 'delete', color: '#E44C4C' }}
                  onPressRightIcon={() => this.removeVariant(item, index)}
                />)
              })}
            </View>
          </Card>
          <View
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderColor: '#989999',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              flexDirection: 'row',
              padding: 10,
              paddingHorizontal: 24
            }}
          >
            <Text style={{ flex: 1, color: '#1A86E0', fontWeight: 'bold' }}>
              Total
            </Text>
            <Text style={{ flex: 1, color: '#1A86E0', textAlign: 'right', fontWeight: 'bold' }}>
              {productVariants
                ? productVariants.reduce((all, item) => {
                  return all + item.quantity
                }, 0)
                : 0}
            </Text>
          </View>
          <Card containerStyle={{
            margin: 0,
            marginTop: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: undefined,
            height: undefined
          }}>
            <Text
              style={{ color: '#6F4E37', paddingVertical: 10, fontWeight: 'bold' }}>
              Other information
            </Text>
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  paddingHorizontal: 24
                }}
              >
                <View style={{ flex: 1, height: 60, justifyContent: 'center' }}>
                  <Text style={{
                    width: '100%'
                  }}>
                    Weight (kg)
                  </Text>
                </View>
                <View style={{ flex: 1, height: 60, justifyContent: 'center' }}>
                  <FormInput
                    value={weight ? `${weight}` : ''}
                    placeholder='Set weight'
                    onChangeText={(text) => {
                      this.setState({
                        weight: text
                      })
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  paddingHorizontal: 24
                }}
              >
                <View style={{ flex: 1, height: 60, justifyContent: 'center', paddingTop: 10 }}>
                  <Text>
                    New/ Used?
                  </Text>
                </View>
                <View style={{ flex: 1, height: 60, justifyContent: 'center' }}>
                  <Dropdown
                    value={isNew}
                    data={[
                      {
                        value: 1,
                        label: 'New'
                      },
                      {
                        value: 0,
                        label: 'Used'
                      }
                    ]}
                    containerStyle={{ marginHorizontal: 16 }}
                    onChangeText={(value) => {
                      this.setState({
                        isNew: value
                      })
                    }}
                  />
                </View>
              </View>
            </View>
          </Card>
          <Card containerStyle={{
            margin: 0,
            paddingVertical: 10,
            paddingHorizontal: 20,
            width: undefined,
            height: undefined
          }}>
            <Text
              style={{ color: '#6F4E37', paddingVertical: 10, fontWeight: 'bold' }}>
              Shipping to countries
            </Text>
            <View style={{ flexDirection: 'column' }}>
              <ScrollView
                style={{ width: '100%', height: undefined, maxHeight: 300 }}
                contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}
              >
                {productCountries && productCountries.map(item => {
                  const country = countries.find(country => country.id === item)
                  if (!country) {
                    return null
                  }
                  return (
                    <Badge
                      onPress={() => this.removeCountry(item)}
                      key={item}
                      containerStyle={{
                        width: undefined,
                        height: 40,
                        backgroundColor: '#80BEEE',
                        paddingVertical: 10,
                        marginRight: 10,
                        marginVertical: 5
                      }}
                    >
                      <Text style={{ color: '#FFFFFF' }}>{country.name}</Text>
                    </Badge>
                  )
                })}
              </ScrollView>
              {/* <View
                style={{ width: '100%', height: 300, maxHeight: 300, backgroundColor: 'transparent' }}
                onStartShouldSetResponder={() => {
                  this.setState({ enableScrollViewScroll: false })
                  if (this.refs.myList && this.refs.myList.scrollProperties.offset === 0 && enableScrollViewScroll === false) {
                    this.setState({ enableScrollViewScroll: true })
                  }
                }}
              >
                <ListView
                  scrollEnabled
                  pageSize={40}
                  style={{ width: '100%', height: 300, maxHeight: 300 }}
                  contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}
                  dataSource={dataSource}
                  renderRow={this.renderCountry}
                />
              </View> */}
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  marginTop: 10,
                  height: 'auto',
                  backgroundColor: 'transparent',
                  zIndex: 99
                }}
              >
                <MultiSelect
                  hideTags
                  items={countries}
                  uniqueKey='id'
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.addCountry}
                  selectedItems={productCountries}
                  selectText='Pick country'
                  searchInputPlaceholderText='Search...'
                  tagRemoveIconColor='#CCC'
                  tagBorderColor='#CCC'
                  tagTextColor='#CCC'
                  selectedItemTextColor='#CCC'
                  selectedItemIconColor='#CCC'
                  itemTextColor='#000'
                  displayKey='name'
                  submitButtonColor='#CCC'
                  submitButtonText='Submit'
                  fixedHeight
                  hideSubmitButton
                  searchInputStyle={{
                    color: '#CCC',
                    height: 50
                  }}
                />
              </View>
            </View>
          </Card>
          <FormValidationMessage>
            {errors.length > 0 && errors.map(item => {
              return `${item}\n`
            })}
          </FormValidationMessage>
          <View
            style={{
              width: '100%',
              height: undefined,
              flexDirection: 'row',
              paddingBottom: 10
            }}
          >
            <Button
              title={product.status === -1 ? 'Enable' : 'Delete'}
              onPress={this.toggleProduct}
              containerViewStyle={{ paddingLeft: 10, paddingRight: 0, flex: 1 }} />
            <Button
              title='Submit'
              backgroundColor='#E44C4C'
              onPress={this.submit}
              containerViewStyle={{ paddingLeft: 0, paddingRight: 10, flex: 1 }} />
          </View>
        </View>
        <Modal
          animationType='slide'
          transparent={false}
          visible={editPrice}
        >
          <View style={{ width: '100%', height }}>
            <ProductPriceEdit
              price={price}
              onEditPrice={this.onEditPrice}
              onBack={this.editPriceModal}
            />
          </View>
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={addPrice}
        >
          <View style={{ width: '100%', height }}>
            <ProductPrice
              onAddPrice={this.onAddPrice}
              onBack={this.addPriceModal}
              productPrices={productPrices}
            />
          </View>
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={addCategories}
        >
          <View style={{ width: '100%', height: '100%' }}>
            <CategoryList
              selectCategories={this.selectCategories}
              goBack={addCategories}
            />
          </View>
        </Modal>
        <Modal
          transparent
          animationType='slide'
          visible={addVariant}
        >
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={this.addVariant}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
                backgroundColor:
                  '#000',
                opacity: 0.2
              }}
            />
            <View style={{ width: '100%', height: 320, zIndex: 2 }}>
              <Card title={!variant.id ? 'Add variant' : 'Edit variant'}>
                {!variant.id && <FormLabel>
                  Variant name
                </FormLabel>}
                {!variant.id && <FormInput
                  value={variant.name || ''}
                  placeholder='Enter your variant name for your product'
                  onChangeText={text => this.setState({
                    variant: {
                      ...variant,
                      name: text
                    }
                  })}
                />}
                <FormLabel>
                  Variant quantity
                </FormLabel>
                <FormInput
                  value={`${variant.id ? variant.originalQuantity : variant.quantity}` || ''}
                  placeholder='Enter original quantity for your variant name'
                  onChangeText={text => this.setState({
                    variant: {
                      ...variant,
                      ...variant.id ? {
                        originalQuantity: text
                      } : {
                        quantity: text
                      }
                    }
                  })}
                  keyboardType={'numeric'}
                />
                {variant.id && <Text style={{ paddingLeft: 17 }}>Onhand quantity: {variant.onhandQuantity}</Text>}
                <Button
                  containerViewStyle={{ marginTop: 10, marginBottom: 10 }}
                  onPress={!variant.id
                    ? this.addNewVariant
                    : this.editVariant
                  }
                  title={!variant.id ? 'Add' : 'Edit'}
                />
              </Card>
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}

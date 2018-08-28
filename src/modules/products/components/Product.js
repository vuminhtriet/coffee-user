import React, { Component } from 'react'
import {
  View,
  Text,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  // ListView,
  Platform
} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import { Dropdown } from 'react-native-material-dropdown'
import {
  FormValidationMessage,
  FormInput,
  ListItem,
  Card,
  Icon,
  Badge,
  Button,
  FormLabel
} from 'react-native-elements'
import MultiSelect from 'react-native-multiple-select'
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
export default class Product extends Component {
  constructor (props) {
    super(props)
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      addPrice: false,
      product: {},
      images: [],
      addVariant: false,
      addCategories: false,
      variant: {},
      name: '',
      description: '',
      weight: '',
      isNew: 1,
      errors: [],
      privateCategoryId: null,
      publicCategoryId: null,
      productPrices: [],
      productVariants: [],
      productCountries: [],
      enableScrollViewScroll: true,
      // dataSource: ds.cloneWithRows(props.countries),
      disabled: false
    }

    this.submit = this.submit.bind(this)
    this.onChoose = this.onChoose.bind(this)
    this.addVariant = this.addVariant.bind(this)
    this.onAddPrice = this.onAddPrice.bind(this)
    this.addCountry = this.addCountry.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.removeCountry = this.removeCountry.bind(this)
    this.onChooseCover = this.onChooseCover.bind(this)
    this.addPriceModal = this.addPriceModal.bind(this)
    this.AddNewVariant = this.AddNewVariant.bind(this)
    this.renderCountry = this.renderCountry.bind(this)
    this.selectCategories = this.selectCategories.bind(this)
    this.addCategoryModal = this.addCategoryModal.bind(this)
    this.renderCountryKey = this.renderCountryKey.bind(this)
    this.onChangeProductName = this.onChangeProductName.bind(this)
    this.onChangeProductDescription = this.onChangeProductDescription.bind(this)
  }
  renderCountry (item) {
    const { productCountries } = this.state
    const exist = productCountries && productCountries.includes(item.id)
    if (exist) {
      return null
    }
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
  renderCountryKey (item) {
    return item.id
  }
  async submit () {
    this.setState({ disabled: true })
    const {
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
      shop,
      token,
      addProduct,
      shopDeliveryMethods
    } = this.props

    const errors = []
    if (!shopDeliveryMethods || !shopDeliveryMethods.length) {
      errors.push('* Shop delivery method required for create product.')
    }
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
        disabled: true
      })
    }

    await addProduct(
      token,
      {
        name,
        description,
        publicCategoryId,
        privateCategoryId,
        productPrices,
        productVariants,
        weight,
        isNew,
        productCountries
      },
      images,
      shop
    )
    await getShopProducts(shop)
    this.setState({ disabled: false })
    navigation.goBack()
  }
  addPriceModal () {
    const { addPrice } = this.state
    this.setState({
      addPrice: !addPrice
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
  addVariant () {
    const { addVariant } = this.state
    this.setState({
      addVariant: !addVariant
    })
  }
  addCategoryModal () {
    const { addCategories } = this.state
    this.setState({
      addCategories: !addCategories,
      errors: []
    })
  }
  removeImage (index) {
    let { images } = this.state
    images.splice(index, 1)
    this.setState({
      images: [
        ...images
      ]
    })
  }
  AddNewVariant () {
    let { variant, productVariants } = this.state
    if (!variant.name || !variant.quantity || !parseInt(variant.quantity)) {
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
      variant: {},
      errors: [],
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
    let { images } = this.state
    images = images.map((item) => {
      item.type = 3
      return item
    })
    images[index] = {
      ...images[index],
      type: 2
    }
    this.setState({
      images: [
        ...images
      ]
    })
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

    productVariants.splice(index, 1)
    this.setState({
      productVariants: [
        ...productVariants
      ],
      variant: {},
      addVariant: false
    })
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
      errors,
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
      enableScrollViewScroll,
      addCategories
      // disabled
    } = this.state
    const { countries } = this.props
    return (
      <ScrollView
        scrollEnabled={enableScrollViewScroll}
        style={{
          width: '100%',
          height: undefined
        }}
      >
        <View
          // onStartShouldSetResponderCapture={() => {
          //   this.setState({ enableScrollViewScroll: true })
          // }}
          style={{ flexDirection: 'column', backgroundColor: 'transparent' }}
        >
          <ScrollView
            horizontal
            style={{
              width: '100%',
              height: 100,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#FFFFFF'
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
                      source={{ uri: image.fileUri }}
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
          <Card
            containerStyle={{
              margin: 0,
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: undefined,
              height: undefined
            }}>
            <FormInput
              multiline
              numberOfLines={2}
              value={name}
              containerStyle={{ margin: 0, padding: 0 }}
              style={{ margin: 0, padding: 0 }}
              inputStyle={{ margin: 0, padding: 0 }}
              placeholder='Enter product name'
              onChangeText={this.onChangeProductName}
            />

            <View style={{ width: undefined }}>
              <FormInput
                value={description}
                multiline
                style={{
                  height: undefined
                }}
                inputStyle={{ width: '100%' }}
                containerStyle={{ minHeight: 60, marginVertical: 0, padding: 0 }}
                placeholder='Enter product description'
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
            key={privateCategoryId.id}
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
            key={publicCategoryId.id}
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
                const { origin } = price
                let priceString = origin.cash
                  ? `${origin.cash.value} ${origin.cash.unit.code}` : ''
                priceString += priceString.length && origin.crypto
                  ? ' + ' : ''
                priceString += origin.crypto
                  ? `${origin.crypto.value} ${origin.crypto.unit.code}` : ''
                return (
                  <ListItem
                    key={index}
                    title={`Option ${index + 1}`}
                    rightTitle={priceString}
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
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 20,
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
          <Card
            containerStyle={{
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
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  marginTop: 10,
                  height: 'auto',
                  backgroundColor: 'transparent',
                  zIndex: 99
                }}
              // onStartShouldSetResponderCapture={(event) => {
              //   console.log('<<<<', event)
              //   this.setState({ enableScrollViewScroll: false })
              //   console.log('>>>>>>', this.refs.myList.scrollProperties.offset)
              //   if (this.refs.myList.scrollProperties.offset === 0 && enableScrollViewScroll === false) {
              //     this.setState({ enableScrollViewScroll: true })
              //   }
              // }}
              // onStartShouldSetResponder={() => {
              //   this.setState({ enableScrollViewScroll: false })
              //   if (this.refs.myList.scrollProperties.offset === 0 && enableScrollViewScroll === false) {
              //     this.setState({ enableScrollViewScroll: true })
              //   }
              // }}
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
                {/* <ListView
                  scrollEnabled
                  pageSize={40}
                  ref='myList'
                  style={{ width: '100%', height: 300, maxHeight: 300 }}
                  contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}
                  dataSource={dataSource}
                  renderRow={this.renderCountry}
                /> */}
              </View>
            </View>
          </Card>
          <FormValidationMessage>
            {errors.length > 0 && errors.map(item => {
              return `${item}\n`
            })}
          </FormValidationMessage>
          <Button
            title='Submit'
            backgroundColor='#E44C4C'
            onPress={this.submit}
            containerViewStyle={{ paddingVertical: 10 }} />
        </View>
        <Modal
          animationType='slide'
          transparent={false}
          visible={addPrice}
        >
          <View style={{ width: '100%', height }}>
            <ProductPrice
              productPrices={productPrices}
              onAddPrice={this.onAddPrice}
              onBack={this.addPriceModal}
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
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
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
              <Card title='Add variant'>
                <FormLabel>
                  Variant name
                </FormLabel>
                <FormInput
                  value={variant.name || ''}
                  placeholder='Enter your variant name for your product'
                  onChangeText={text => this.setState({
                    variant: {
                      ...variant,
                      name: text
                    }
                  })}
                />
                <FormLabel>
                  Variant quantity
                </FormLabel>
                <FormInput
                  value={variant.quantity || ''}
                  placeholder='Enter original quantity for your variant name'
                  onChangeText={text => this.setState({
                    variant: {
                      ...variant,
                      quantity: text
                    }
                  })}
                  keyboardType={'numeric'}
                />
                <Button
                  containerViewStyle={{ marginTop: 10, marginBottom: 10 }}
                  onPress={this.AddNewVariant}
                  title='Add'
                />
              </Card>
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}

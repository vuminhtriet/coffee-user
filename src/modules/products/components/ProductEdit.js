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
// const ImagePicker = require('react-native-image-picker')
import ImagePicker from 'react-native-image-picker'
const { height } = Dimensions.get('window')
import { TextInputMask } from 'react-native-masked-text'
import { validatePhoneNumber } from '../../../common/utils/validate'
import { isEmpty } from 'lodash'

const options = {
  title: 'Đăng hình ảnh đồ uống',
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
    this.state = {
      disabled: false,
      stateProduct: product,
      images: product.productCoverImage ? product.productCoverImage : [],
      addCategories: false,
      name: product.productName,
      description: product.productDescription,
      privateCategoryId: product.categoryId && privateCategories && privateCategories
        .find(item => item.id === product.categoryId),
      // quantity: product.productQuantity,
      // dataSource: ds.cloneWithRows(props.countries),
      editPrice: false,
      price: {},
      errors: {},
      enableScrollViewScroll: true,
      productPrices: product.productPrice
    }
    this.submit = this.submit.bind(this)
    this.onChoose = this.onChoose.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.onChooseCover = this.onChooseCover.bind(this)
    this.toggleProduct = this.toggleProduct.bind(this)
    this.selectCategories = this.selectCategories.bind(this)
    this.addCategoryModal = this.addCategoryModal.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  async toggleProduct () {
    const { shop, token, toggleProduct, getShopProducts, navigation, product } = this.props
    const { stateProduct } = this.state
    await toggleProduct(token, product)
    getShopProducts(shop)
    navigation.goBack()
  }

  async submit () {
    this.setState({ disabled: true })
    const {
      stateProduct,
      images,
      name,
      weight,
      isNew,
      privateCategoryId,
      description,
      productPrices,
      // quantity
    } = this.state
    const {
      getShopProducts,
      navigation,
      user,
      shop,
      token,
      editProduct, product } = this.props

    const errors = {}
      // if (!shopDeliveryMethods || !shopDeliveryMethods.length) {
      //   errors.push('* Shop delivery method required for create product.')
      // }
    if (!name) {
      errors.name = '* Thiếu tên đồ uống.'
    }
    if (!description) {
      errors.description = '* Thiếu mô tả.'
    }
    if (!productPrices) {
      errors.productPrices = '* Thiếu giá tiền.'
    }else if (!validatePhoneNumber(productPrices)) {
      errors.productPrices = '* Giá tiền không hợp lệ.'
    }
    // if (!quantity) {
    //   errors.quantity = '* Thiếu số lượng.'
    // }else if (!validatePhoneNumber(quantity)) {
    //   errors.quantity = '* Số lượng không hợp lệ.'
    // }

    if (!isEmpty(errors)) {
      return this.setState({ errors })
    }

    // TODO: Handle images
    let cover = images[0]
    let deleteImages = []
    let newImages = []

    deleteImages = product.productCoverImage && product.productCoverImage.filter(item => {
      const image = images.find(image => image === item)
      if (image) {
        return false
      }
      return true
    })
    newImages = images.filter((item, index) => {
      const image = product.productCoverImage && 
      product.productCoverImage.find(image => image === item)
      if (image) {
        return false
      }
      return true
    })

    const result = await editProduct(token,
      product, {
        name,
        description,
        privateCategoryId,
        productPrices,
        // quantity
      }, 
      newImages, deleteImages, cover,
      user, shop)
    if (result) {
      await getShopProducts(shop)
      this.setState({ disabled: false })
      navigation.goBack()
    }
    this.setState({ disabled: false })
  }

  addCategoryModal () {
    const { addCategories } = this.state
    this.setState({
      addCategories: !addCategories,
      errors: {}
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

  selectCategories (item) {
    if (!item || !item.id) {
      return this.setState({
        addCategories: false
      })
    }
    this.setState({
      ['privateCategoryId']: item,
      addCategories: false,
      errors: {}
    })
  }
  onChooseCover (index) {
    let { images } = this.state
    var element = images.splice(index,1)
    images.unshift(element[0])
    this.setState({
      images: [
        ...images
      ]
    })
  }
  onChoose () {
    const { images } = this.state
    if (images && images.length > 5) {
      return false
    }
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

  onChangeText (text, field) {
    const { errors } = this.state
    this.setState({
      [field]: text,
      errors: {
        ...errors,
        [field]: undefined
      }
    })
  }

  render () {
    const {
      stateProduct,
      errors,
      name,
      description,
      disabled,
      // quantity,
      images,
      // dataSource,
      productPrices,
      privateCategoryId,
      // enableScrollViewScroll,
      addCategories
    } = this.state
    const { product } = this.props
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
                      source={{ uri: image.fileUri ? image.fileUri : (image.length > 0 ? image : '') }}
                    />
                    {index === 0 && (
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
                  Đăng hình ảnh
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
            * Chọn vào hình bạn muốn làm ảnh đại diện
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
              inputStyle={{ margin: 0, padding: 0, textDecorationColor: 'black', color: 'black' }}
              placeholder='Nhập tên đồ uống'
              onChangeText={(text) => {
                this.onChangeText(text, 'name') }}
            />

            {errors.name &&
              (<FormValidationMessage>{errors.name}</FormValidationMessage>)}

            <View style={{ width: undefined }}>
              <FormInput
                value={description}
                multiline
                style={{
                  marginRight: 10
                }}
                inputStyle={{ textDecorationColor: 'black', color: 'black' }}
                containerStyle={{ minHeight: 20, marginVertical: 0, padding: 0 }}
                placeholder='Nhập mô tả'
                onChangeText={(text) => {
                  this.onChangeText(text, 'description') }}
              />

              {errors.description &&
              (<FormValidationMessage>{errors.description}</FormValidationMessage>)}

              {/* <FormInput
                style={{
                  height: undefined
                }}
                keyboardType='phone-pad'
                inputStyle={{ width: '100%', textDecorationColor: 'black', color: 'black' }}
                containerStyle={{ minHeight: 20, marginVertical: 0, padding: 0 }}
                placeholder='Nhập số lượng tương đối'
                value={quantity.toString()}
                onChangeText={(text) => {
                  this.onChangeText(text, 'quantity') }}
              />
              {errors.quantity &&
              (<FormValidationMessage>{errors.quantity}</FormValidationMessage>)} */}

              <TextInputMask
                ref={ref => (this.inputRef = ref)}
                type={'money'}
                options={{
                  suffixUnit: '',
                  unit: 'VND ',
                  separator: ' ',
                  precision: 0
                }}
                style={{ 
                  fontSize: 15, marginLeft: 15, marginRight: 11
                }}
                placeholder='Nhập giá tiền'
                value={ productPrices}
                onChangeText={(text) => {
                  this.onChangeText(this.inputRef.getRawValue(), 'productPrices') }}
              />
              {errors.productPrices &&
              (<FormValidationMessage>{errors.productPrices}</FormValidationMessage>)}

            </View>
          </Card>
          <ListItem
            containerStyle={{ backgroundColor: '#FFFFFF' }}
            leftIcon={{ name: 'format-align-left' }}
            title='Danh mục'
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

          {/* <Card containerStyle={{
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
          </Card> */}
          {/* <Card containerStyle={{
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
          </Card> */}
          {/* <View
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
          </View> */}
          {/* <Card containerStyle={{
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
          </Card> */}
          {/* <Card containerStyle={{
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
              {/* <View
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
          </Card> */}
          {/* <FormValidationMessage>
            {errors.length > 0 && errors.map(item => {
              return `${item}\n`
            })}
          </FormValidationMessage> */}
          <View
            style={{
              width: '100%',
              height: undefined,
              flexDirection: 'row',
              paddingBottom: 10,
              paddingTop: 20
            }}
          >
            <Button
              title={'Xóa'}
              onPress={this.toggleProduct}
              containerViewStyle={{ paddingLeft: 10, paddingRight: 0, flex: 1 }} />
            <Button
              disabled={disabled}
              title='Cập nhật'
              backgroundColor='#E44C4C'
              onPress={this.submit}
              containerViewStyle={{ paddingLeft: 0, paddingRight: 10, flex: 1 }} />
          </View>
        </View>
        {/* <Modal
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
        </Modal> */}
        {/* <Modal
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
        </Modal> */}
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
        {/* <Modal
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
        </Modal> */}
      </ScrollView>
    )
  }
}

import React, { Component, PureComponent } from 'react'
import {
  Animated,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import { FormValidationMessage, Button, Icon, Card, ListItem, FormLabel } from 'react-native-elements'
import { SCREENS } from '../../../common/screens'
import Modal from '../../../common/components/elements/Modal'
const ImagePicker = require('react-native-image-picker')

const options = {
  title: 'Upload your images',
  storageOptions: {
    skipBackup: true,
    noData: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true
  }
}

const MENU_LIST = [
  {
    title: 'Thông Tin Quán',
    iconName: 'store',
    iconType: 'material-community',
    screen: SCREENS.ShopInformation
  },
  {
    title: 'Phương Thức Thanh Toán',
    iconName: 'credit-card',
    iconType: 'material-community',
    screen: SCREENS.ShopPaymentMethod
  },
  {
    title: 'Phương Thức Giao Hàng',
    iconName: 'truck-delivery',
    iconType: 'material-community',
    screen: SCREENS.ShopShippingType
  },
  {
    title: 'Quản Lý Danh Mục',
    iconName: 'format-align-left',
    iconType: 'material',
    screen: SCREENS.CategoryManagement
  },
  {
    title: 'Quản Lý Đồ Uống',
    iconName: 'product-hunt',
    iconType: 'font-awesome',
    screen: SCREENS.ProductManagement
  },
  // {
  //   title: 'Processing Cart',
  //   iconName: 'shopping-cart',
  //   iconType: 'font-awesome',
  //   screen: SCREENS.ProcessingCart
  // },
  // {
  //   title: 'Order Management',
  //   iconName: 'file-check',
  //   iconType: 'material-community',
  //   screen: SCREENS.OrderManagement
  // },
  // {
  //   title: 'In Processing Orders',
  //   iconName: 'hourglass-2',
  //   iconType: 'font-awesome',
  //   screen: SCREENS.InProcessingOrders
  // },
  // {
  //   title: 'Completed Orders',
  //   iconName: 'money',
  //   iconType: 'font-awesome',
  //   screen: SCREENS.CompletedOrders
  // },
  // {
  //   title: 'Return Orders',
  //   iconName: 'file-restore',
  //   iconType: 'material-community',
  //   screen: SCREENS.ReturnOrders
  // },
  // {
  //   title: 'Setting',
  //   iconName: 'settings',
  //   iconType: 'material-community',
  //   screen: SCREENS.ShopSetting
  // },
]

class SettingItem extends PureComponent {
  _onPress = () => {
    const { navigatePage, screen } = this.props
    navigatePage(screen)
  }

  render() {
    const { iconName, iconType, title } = this.props
    return (
      <ListItem
        onPress={this._onPress}
        leftIcon={{ name: iconName, type: iconType }}
        title={title}
        hideChevron
        containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
      />
    )
  }
}

export default class ShopSetting extends Component {
  constructor(props) {
    super(props)
    const { shopImages } = props
    const slideCover = shopImages.filter(item => item.type === 2 || item.type === 3)
    const logo = shopImages.find(item => item.type === 1)
    this.state = {
      refreshing: false,
      addImage: false,
      images: slideCover
        ? JSON.parse(JSON.stringify(slideCover))
        : [],
      logo,
      logoId: logo ? logo.id : undefined,
      cover: slideCover.find(item => item.type === 2)
    }
    this.animate = new Animated.Value(0)
    this.onChoose = this.onChoose.bind(this)
    this.onChooseLogo = this.onChooseLogo.bind(this)
    this.uploadImages = this.uploadImages.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.onChooseCover = this.onChooseCover.bind(this)
    this.removeLogoImage = this.removeLogoImage.bind(this)
    this.requestUploadImage = this.requestUploadImage.bind(this)
  }

  componentWillReceiveProps(next) {
    if (next.shopImages && JSON.stringify(next.shopImages) !== JSON.stringify(this.props.shopImages)) {
      const { shopImages } = next
      const slideCover = shopImages.filter(item => item.type === 2 || item.type === 3)
      const logo = shopImages.find(item => item.type === 1)
      this.setState({
        images: slideCover
          ? JSON.parse(JSON.stringify(slideCover))
          : [],
        logo,
        logoId: logo ? logo.id : undefined,
        cover: slideCover.find(item => item.type === 2)
      })
    }
  }

  onChooseCover(index) {
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

  onChooseLogo() {
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
            logo: {
              type: 1,
              fileName,
              fileUri,
              fileData,
              fileOriginUri,
              resized: response
            }
          })
        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
          this.setState({
            logo: {
              type: 1,
              fileName,
              fileUri,
              fileData,
              fileOriginUri,
              resized: undefined
            }
          })
        })
    })
  }

  async uploadImages() {
    const { shopImages, token, shop, uploadImages, getShopImages } = this.props
    const { logoId, logo, images } = this.state
    let editImages = []
    let originLogo = null
    let deleteImages = shopImages.filter(item => {
      const image = images.find(image => image.id === item.id)
      if (item.type === 1) {
        originLogo = item
        return false
      } else if (image) {
        editImages.push({
          ...item,
          type: image.type
        })
        return false
      }
      return true
    })
    const newImages = images.filter(item => !item.id)
    if (logoId && logo && !logo.id) {
      newImages.push(logo)
      deleteImages.push({
        id: logoId,
        ...originLogo
      })
    } else if (!logoId && logo) {
      newImages.push(logo)
    } else if (logoId && !logo) {
      deleteImages.push({
        id: logoId,
        ...originLogo
      })
    }
    await uploadImages(token, shop, newImages, deleteImages, editImages)
    getShopImages(shop)
    this.requestUploadImage()
  }

  onChoose() {
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
        }).catch((err) => {
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

  removeLogoImage() {
    this.setState({
      logo: undefined
    })
  }

  removeImage(index) {
    let { images } = this.state
    images.splice(index, 1)
    this.setState({
      images: [
        ...images
      ]
    })
  }

  requestUploadImage() {
    const { addImage } = this.state
    const { token } = this.props
    if (!token) {
      return false
    }
    this.setState({
      addImage: !addImage
    })
  }

  async componentDidMount() {
    const {
      token,
      user,
      getShopInformation
    } = this.props

    user && token && await getShopInformation(user, token)
  }

  getImageScale() {
    return this.animate.interpolate({
      inputRange: [-50, 0, 200],
      outputRange: [1.5, 1, 1],
      extrapolate: 'clamp'
    })
  }

  _navigatePage = (screen) => {
    const { navigation, token } = this.props
    token ? navigation.navigate(screen) : navigation.navigate(SCREENS.AuthenticatePage)
    // navigation.navigate(screen)
  }

  render() {
    const { logo, images, addImage } = this.state
    const { cover, shop } = this.props
    const {shopFeaturedImages, shopLogo} = shop
    const imageScale = this.getImageScale()
    return (
      <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
        <Animated.Image
          source={
            !shopFeaturedImages || !shopFeaturedImages[0]
              ? require('../../../assets/banner/Banner4.jpg')
              : { uri: shopFeaturedImages[0] }
          }
          style={{ width: '100%', height: 150, transform: [{ scale: imageScale }] }}
          resizeMode='cover'
        />
        <Icon
          name='add-a-photo'
          size={30}
          color='#FFFFFF'
          onPress={this.requestUploadImage}
          containerStyle={{
            width: 40,
            height: 40,
            borderRadius: 20,
            position: 'absolute',
            zIndex: 2,
            top: 100,
            left: 10
          }}
        />
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.animate } } }],
            { useNativeDriver: Platform.OS === 'ios' }
          )}
        >
          <Card containerStyle={{
            margin: 0,
            paddingBottom: 0,
            width: undefined,
            height: undefined
          }}
            title={shop.shopName || 'Shop name'}>
            {
              MENU_LIST.map(item => {
                return (
                  <SettingItem 
                    title={item.title}
                    iconName={item.iconName}
                    iconType={item.iconType}
                    screen={item.screen}
                    navigatePage={this._navigatePage}
                  />
                )
              })
            }
          </Card>
        </Animated.ScrollView>

        <Modal
          transparent
          animationType='none'
          visible={addImage}
          onRequestClose={() => {
            this.setState({
              addImage: false
            })
          }}
        >
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View
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
            <View style={{ width: '100%', height: undefined, maxHeight: '80%', zIndex: 2 }}>
              <Card title='Upload shop images'>
                <FormLabel>
                  Logo
                </FormLabel>
                {logo ? (
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      marginHorizontal: 20,
                      marginVertical: 10,
                      backgroundColor: '#000'
                    }}>
                    <Icon
                      containerStyle={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 2
                      }}
                      onPress={() => this.removeLogoImage()}
                      name='close'
                      color='#E4521B'
                    />
                    <TouchableOpacity
                      style={{
                        zIndex: 1
                      }}
                      onPress={this.onChooseLogo}
                    >
                      <Image
                        resizeMode='contain'
                        style={{ width: 80, height: 80 }}
                        source={{ uri: logo.fullUrl || logo.fileUri }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : Platform.OS === 'ios' ? (
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderWidth: 2,
                      borderStyle: 'dashed',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: '#EE9468',
                      marginHorizontal: 20,
                      paddingVertical: 10
                    }}>
                    <TouchableOpacity
                      onPress={this.onChooseLogo}
                    >
                      <Text style={{ color: '#EE9468' }}>
                        Upload images/videos
                      </Text>
                    </TouchableOpacity>
                  </View>) : (
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          marginHorizontal: 20,
                          paddingVertical: 10,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <Icon
                          name='add-a-photo'
                          size={40}
                          onPress={this.onChooseLogo}
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
                    )
                }
                <FormLabel>
                  {`Cover & Slide`}
                </FormLabel>
                <ScrollView
                  horizontal
                  style={{
                    width: '100%',
                    height: 100,
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
                            source={{ uri: image.fullUrl || image.fileUri }}
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
                <FormValidationMessage containerStyle={{ marginBottom: 15 }}>
                  * Touch an image you want to choose it as a cover picture
                </FormValidationMessage>
                <View style={{
                  width: '100%',
                  height: 60,
                  flexDirection: 'row',
                  marginTop: 10
                }}>
                  <Button
                    title='Cancel'
                    onPress={this.requestUploadImage}
                    containerViewStyle={{ flex: 1, paddingRight: 5 }}
                  />
                  <Button
                    title='Upload'
                    backgroundColor='#992320'
                    onPress={this.uploadImages}
                    containerViewStyle={{ flex: 1, paddingLeft: 5 }}
                  />
                </View>
              </Card>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

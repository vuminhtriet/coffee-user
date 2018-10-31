import React, { Component } from 'react'
import {
  Image,
  Animated,
  View,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import { Icon, Card, ListItem, Divider, Button, FormLabel } from 'react-native-elements'
import { SCREENS } from '../../../common/screens'
import Modal from '../../../common/components/elements/Modal'
import moment from 'moment'
const day = moment().get('date')
const month = moment().get('month')

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
export default class UserSetting extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      image: null,
      modalShow: false
    }
    this.animate = new Animated.Value(0)

    this.onNext = this.onNext.bind(this)
    this.cancelUpload = this.cancelUpload.bind(this)
    this.submitImages = this.submitImages.bind(this)
    this.requestUploadImage = this.requestUploadImage.bind(this)
  }

  cancelUpload () {
    const { modalShow } = this.state
    this.setState({
      modalShow: !modalShow
    })
  }

  async submitImages () {
    const { image } = this.state
    const { token, user, uploadUserImage, userImage, getUserImage } = this.props
    const result = await uploadUserImage(token, user, {
      add: image,
      delete: userImage
    })
    if (result) {
      user && getUserImage(user)
    }
    this.cancelUpload()
  }

  requestUploadImage () {
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
            image: {
              type: 3,
              fileName,
              fileUri,
              fileData,
              fileOriginUri,
              resized: response
            },
            modalShow: true
          })
        }).catch(() => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
          this.setState({
            images: {
              type: 3,
              fileName,
              fileUri,
              fileData,
              fileOriginUri,
              resized: undefined
            },
            modalShow: true
          })
        })
    })
  }

  getImageScale () {
    return this.animate.interpolate({
      inputRange: [-50, 0, 200],
      outputRange: [1.5, 1, 1],
      extrapolate: 'clamp'
    })
  }

  onNext () {
    const { logout, token, navigation } = this.props
    if (token) {
      return logout()
    }
    navigation.navigate(SCREENS.AuthenticatePage)
  }

  componentDidMount () {
    const { token, user, getUserInformation, getUserImage } = this.props
    token && user && getUserInformation(token, user.id)
    user && getUserImage(user)
  }

  render () {
    const { image, modalShow } = this.state
    const { user, navigation, token, userImage } = this.props
    const imageScale = this.getImageScale()
    return (
      <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
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
            height: undefined }}
          >
            <TouchableOpacity
              onPress={this.requestUploadImage}
              style={{
                flexDirection: 'row',
                paddingVertical: 20,
                paddingHorizontal: 12
              }}>
              <Animated.Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  transform: [{ scale: imageScale }]
                }}
                source={{
                  uri: userImage
                    ? userImage.fullUrl
                    : 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png'
                }}
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
                  top: 85,
                  left: 40
                }}
              />
              <View style={{ flex: 1, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                  {token && user.displayName}
                </Text>
                <FormLabel>
                  {token && user.email}
                </FormLabel>
              </View>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: '#9C9C9C', height: 1, width: '120%', marginLeft: -20 }} />
            <ListItem
              onPress={() => token && navigation.navigate(SCREENS.UserInformation)}
              leftIcon={{ name: 'user-o', type: 'font-awesome' }}
              title='Thông Tin Chung'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            />
            {/* <ListItem
              onPress={() => token && navigation.navigate(SCREENS.UserPaymentMethod)}
              leftIcon={{ name: 'credit-card', type: 'material-community' }}
              title='User Payment Methods'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            />
            <ListItem
              onPress={() => token && navigation.navigate(SCREENS.UserOrderManagement)}
              leftIcon={{ name: 'list-alt', type: 'font-awesome' }}
              title='My orders'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            />
            <ListItem
              onPress={() => token && navigation.navigate(SCREENS.BoughtProductPage)}
              leftIcon={{ name: 'file-check', type: 'material-community' }}
              title='My bought products - Write a review'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            /> */}
            {/* <ListItem
              leftIcon={{ name: 'file-restore', type: 'material-community' }}
              title='Return Orders'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            /> */}
            {/* <ListItem
              onPress={() => token && navigation.navigate(SCREENS.ChatHistoryPage)}
              leftIcon={{ name: 'comment', type: 'font-awesome' }}
              title='My messages'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            /> */}
            {/* <ListItem
              leftIcon={{ name: 'settings', type: 'material-community' }}
              title='Setting'
              hideChevron
              containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            /> */}
          </Card>
          <Button
            title={token ? 'ĐĂNG XUẤT' : 'ĐĂNG NHẬP / ĐĂNG KÝ'}
            backgroundColor='#E44C4C'
            containerViewStyle={{ marginVertical: 20 }}
            onPress={this.onNext}
          />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text>Version: 0.1.1201</Text>
          </View>
        </Animated.ScrollView>
        <Modal
          transparent
          animationType='none'
          visible={modalShow}
          onRequestClose={() => {
            this.setState({
              modalShow: false
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
            <View
              style={{
                width: '100%',
                height: undefined,
                maxHeight: '80%',
                zIndex: 2
              }}
            >
              <Card>
                {image && <Image
                  source={{ uri: image.fileUri }}
                  style={{
                    height: 300,
                    width: 'auto'
                  }}
                />}
                <View style={{
                  width: '100%',
                  height: 60,
                  flexDirection: 'row',
                  marginTop: 10
                }}>
                  <Button
                    title='Hủy'
                    onPress={this.cancelUpload}
                    containerViewStyle={{ flex: 1, paddingRight: 5 }}
                  />
                  <Button
                    title='Đăng'
                    backgroundColor='#992320'
                    onPress={this.submitImages}
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

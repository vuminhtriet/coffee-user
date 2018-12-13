import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Image
} from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'
import HeaderFilter from '../../../common/components/elements/HeaderFilter'
import ImageResizer from 'react-native-image-resizer'
import { PAYMENT_STATUS, PAYMENT_TYPE } from '../../../common/models';

// const ImagePicker = require('react-native-image-picker')
import ImagePicker from 'react-native-image-picker'
const options = {
  title: 'Upload your payment proof',
  storageOptions: {
    skipBackup: true,
    noData: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true
  }
}

export default class ProofList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }

  onRefresh() {
  }

  onLoadMore() {
  }

  keyExtractor(item) {
    return item.id
  }

  onRemoveImage = () => {

  }

  onSelectImage = (response, paymentId) => {
    const { onImageUpload } = this.props
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
        const image = {
          paymentId,
          cover: false,
          fileName,
          fileUri,
          fileData,
          fileOriginUri,
          resized: response,
          status: 1
        }
        onImageUpload(image)
      }).catch((err) => {
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
        const image = {
          paymentId,
          cover: false,
          fileName,
          fileUri,
          fileData,
          fileOriginUri,
          resized: undefined,
          status: 1
        }
        onImageUpload(image)
      })
  }

  getPhotosFromGallery = (paymentId) => {
    ImagePicker.launchImageLibrary(options, (response) => this.onSelectImage(response, paymentId))
  }

  getPhotosFromCamera = (paymentId) => {
    ImagePicker.launchCamera(options, () => this.onSelectImage(paymentId))
  }

  renderItem({ index, item }) {
    const { isUser, paymentStatus } = this.props
    const { images, removeProof, removeImage } = this.props
    const proofs = item.proofs
    return (
      <Card
        containerStyle={{ width: undefined, margin: 5 }}
      >
        <View
          style={{
            position: 'absolute',
            zIndex: 999,
            right: -10,
            top: 0,
            width: 140,
            height: 60
          }}
        >
          {isUser && item.paymentType && paymentStatus !== PAYMENT_STATUS.PAID &&
            <Button
              backgroundColor='green'
              onPress={() => this.getPhotosFromGallery(item.id)}
              buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
              icon={{ name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 } }}
              title='Add'
            />
          }
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={{
              marginBottom: 0,
              textAlign: 'left',
              fontWeight: 'bold',
              paddingRight: 120,
              paddingBottom: 5,
              minHeight: 60
            }}
          >
            {item.paymentType ? `${item.paymentType.name}` : ``}
          </Text>
          {proofs && proofs
            .filter(image => image.status === 1)
            .map((image, index) => {
              return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Image
                    style={{
                      width: 100,
                      height: 100
                    }}
                    resizeMode='contain'
                    source={{
                      uri: image.fullUrl
                        ? image.fullUrl
                        : 'https://cf.shopee.vn/file/5fe4982cf64c33971ebc5d0e13b40979_tn'
                    }}
                  />
                  {isUser && paymentStatus !== PAYMENT_STATUS.PAID && <Icon
                    name='delete'
                    color='#E44C4C'
                    type='material-community'
                    onPress={() => { removeProof(image) }}
                    containerStyle={{ paddingLeft: 20 }}
                  />}
                </View>
              )
            })}
          {isUser && images && images
            .filter((image) => image.paymentId === item.id && image.status === 1)
            .map((image, index) => {
              return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Image
                    key={index}
                    style={{
                      width: 100,
                      height: 100
                    }}
                    resizeMode='contain'
                    source={{ uri: image.fileUri }}
                  />
                  {isUser && paymentStatus !== PAYMENT_STATUS.PAID && <Icon
                    name='delete'
                    color='#E44C4C'
                    type='material-community'
                    onPress={() => { removeImage(image) }}
                    containerStyle={{ paddingLeft: 20 }}
                  />}
                </View>
              )
            })}
        </View>
      </Card >
    )
  }

  render() {
    const { refreshing } = this.state
    const { data, onBack } = this.props
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderFilter
            title='Proofs info'
            done={onBack} />
        </View>
        <FlatList
          data={data}
          refreshing={refreshing}
          extraData={{ data }}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
      </View>
    )
  }
}

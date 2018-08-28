import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import { Avatar, Divider } from 'react-native-elements'
import { timestampToDatetime, getInitials } from '../../../common/utils/format'
import { getTop2ActivePrice, getFirstImgUrl } from '../../../common/utils/productUtils'
import ImageStorage from './ImageStorage'
import { STRING_DELIMITER, ROOT_STORAGE_PATH } from '../models'
import { SCREENS } from '../../../common/screens'
import * as firebase from '../../../common/firebase'

function showPrices (price, index, currencyUnits) {
  const cashUnit = price.cashUnitId ? currencyUnits.find(item => item.id === price.cashUnitId) : null
  const electricUnit = price.electricUnitId ? currencyUnits.find(item => item.id === price.electricUnitId) : null
  return (
    <View
      key={index}
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      {
        cashUnit && electricUnit
          ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>
            {price.cashValue}<Text style={{ fontSize: 10 }}>{cashUnit ? cashUnit.code : ''}</Text> + {price.electricValue}<Text style={{ fontSize: 10 }}>{electricUnit ? electricUnit.code : ''}</Text>
          </Text>
          : cashUnit && !price.electricValue
            ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>{price.cashValue}<Text style={{ fontSize: 10 }}>{cashUnit ? cashUnit.code : ''}</Text></Text>
            : electricUnit && !price.cashValue
              ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>{price.electricValue}<Text style={{ fontSize: 10 }}>{electricUnit ? electricUnit.code : ''}</Text></Text>
              : null
      }
    </View>
  )
}


export default class ChatItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uri: '',
      productExist: true
    }
  }

  async getProductDetail(productId) {
    const { getProductDetail, token } = this.props
    const currentUserId = this.props.user.id + ''
    const result = await getProductDetail(token, productId)
    if (result) {
      this.setState({ productDetail: result })
    } else {
      this.setState({ productExist: false })
    }
  }

  componentDidMount() {
    const { item, getProductDetail } = this.props
    if (item.messageType == 2) {
      firebase.getDownloadLink(item.message, (uri) => {
        this.setState({ uri: uri })
      })
    } else if (item.messageType == 3) {
      this.getProductDetail(item.message)
    }
  }

  openImage = () => {
    const { onViewImage } = this.props
    onViewImage(this.state.uri)
  }

  openProduct = () => {
    const { navigation } = this.props
    const { productDetail, productExist } = this.state
    if (productDetail) {
      navigation.navigate(SCREENS.ProductDetail, {
        productItem: productDetail
      })
    }
  }

  renderTextContent(item) {
    const currentUserId = this.props.user.id + ''
    const { productDetail, productExist } = this.state
    const { currencyUnits } = this.props
    const fullUrl = productDetail ? getFirstImgUrl(productDetail.images) : null
    switch (item.messageType) {
      case 1: //Text message
        return (
          <View style={item.sender != currentUserId ? styles.leftTextContainer : styles.rightTextContainer}>
            <Text style={item.sender != currentUserId ? styles.leftMessageText : styles.rightMessageText}>
              {`${item.message}`}
            </Text>
          </View>
        )
      case 2: //Image message
        return (
          <TouchableOpacity style={item.sender != currentUserId ? styles.leftImageContainer : styles.rightImageContainer}
            onPress={() => this.openImage()}>
            <Image
              style={styles.messageImage}
              source={{ uri: this.state.uri }}
            />
          </TouchableOpacity>
        )
      case 3: //Product message
        return (
          <TouchableOpacity style={item.sender != currentUserId ? styles.leftProductContainer : styles.rightProductContainer}
            onPress={() => this.openProduct()}>
            {fullUrl
              ? <Image
                style={styles.productImage}
                source={{ uri: fullUrl }}
              /> : <Image
                style={styles.productImage}
                source={require('../../../assets/placeholder.png')}
              />
            }
            {productExist ?
              <View style={styles.productDetail}>
                <Text numberOfLines={2}>{productDetail ? productDetail.name : ''}</Text>
                <View style={{ marginBottom: 0, marginTop: 3 }}>
                  {productDetail && productDetail.productPrices && getTop2ActivePrice(productDetail.productPrices).map((price, index) => showPrices(price, index, currencyUnits))}
                </View>
              </View> :
              <View style={styles.productDetail}>
                <Text>Sản phẩm không tồn tại</Text>
              </View>
            }
          </TouchableOpacity>
        )
    }
    return (
      <View style={styles.textContainer}>
        <Text style={styles.userText}>
          {`${item.sender}`}
        </Text>
      </View>
    )
  }

  render() {
    const { index, item, opponentUser, isChatWithShop, openShopDetail } = this.props
    const currentUserId = this.props.user.id + ''

    let title = ''
    let userAvatar = 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png'
    if (opponentUser) {
      name = opponentUser.displayName
      if (isChatWithShop && opponentUser.shop && opponentUser.shop.name) {
        name = opponentUser.shop.name
      }
      title = getInitials(name)
      if (opponentUser.images && opponentUser.images.length > 0) {
        userAvatar =  opponentUser.images[0].fullUrl
      }
    }
    return (
      <View style={item.sender != currentUserId ? styles.leftOuterContainer : styles.rightOuterContainer}>
        <View style={item.sender != currentUserId ? styles.leftItemContainer : styles.rightItemContainer}>
          {
            (item.sender != currentUserId) && <Avatar
              small
              rounded
              title={title}
              source={{ uri: userAvatar }}
              activeOpacity={0.7}
              onPress={() => openShopDetail()}
            />
          }
          <View style={item.sender != currentUserId ? styles.leftContentContainer : styles.rightContentContainer}>
            {this.renderTextContent(item)}
            <Text style={styles.dateText}>
              {timestampToDatetime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  leftOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  leftItemContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 8
  },
  rightItemContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    margin: 8
  },
  leftContentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 8
  },
  rightContentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    margin: 8
  },
  leftTextContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    backgroundColor: '#DFE6E9',
  },
  rightTextContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    backgroundColor: '#6F4E37',
  },
  leftImageContainer: {
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    backgroundColor: '#DFE6E9',
  },
  rightImageContainer: {
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    backgroundColor: '#6F4E37',
  },
  leftProductContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#DFE6E9',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10
  },
  rightProductContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6F4E37',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10
  },
  productDetail: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  productTitle: {
    flex: 1,
  },
  productNewPrice: {

  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  leftMessageText: {
    color: 'black',
    fontSize: 14
  },
  rightMessageText: {
    color: 'white',
    fontSize: 14
  },
  dateText: {
    color: 'black',
    fontSize: 12,
    marginRight: 6
  }
})
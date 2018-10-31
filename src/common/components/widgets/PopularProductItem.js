import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import axios from 'axios'
import { TEST_URL } from '../../../common/models'
import { SCREENS } from '../../screens'
import { getTop2ActivePrice, getFirstImgUrl } from '../../utils/productUtils'

class PopularProductItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shopName: null,
    }
  }

  onPress = () => {
    const { navigation, item } = this.props
    navigation.navigate(SCREENS.ProductDetail, { productItem: item })
  }

  componentDidMount() {
    // const { navigation, item } = this.props
    // const url = `${TEST_URL}/api/shops/${item.shopId}?filter=%7B"fields":"shopName"%7D`

    // this.setState({ loading: true }, () => {
    //   axios({
    //     url,
    //     timeout: 5000
    //   })
    //     .then(response => {
    //       const shop = response.data
    //       this.setState({
    //         shopName: shop.shopName,
    //         loading: false
    //       })
    //     })
    //     .catch(e => {
    //       this.setState({ shopName: null })
    //     })
    // })
    
  }

  render () {
    const { item, itemWith, itemHeight, currencyUnits } = this.props
    const { productCoverImage } = item
    const { shopName } = this.state
    // const fullUrl = getFirstImgUrl(images)

    return (
      <TouchableOpacity
        style={{
          width: itemWith,
          height: itemHeight,
          flexDirection: 'column',
          paddingHorizontal: 5,
          paddingBottom: 0
        }}
        onPress={this.onPress}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: '#D4D4D4',
            padding: 4,
            flex: 1
          }}
        >
          {productCoverImage
            ? <Image
              style={{ height: 124, width: '100%' }}
              source={{ uri: productCoverImage[0] }}
            /> : <Image
              style={{ height: 124, width: '100%' }}
              source={require('../../../assets/drinkplaceholder.png')}
            />
          }
          <Text numberOfLines={1} style={{ marginTop: 5, marginBottom: 0, textAlign: 'center', 
          paddingLeft: 5, paddingRight: 5, fontSize: 17, fontWeight: 'bold' }}>
            {`${item.productName}`}
          </Text>
          {item.shop && item.shop.shopName
            ? <Text numberOfLines={1} style={{ marginTop: 5, marginBottom: 0, textAlign: 'center', 
            paddingLeft: 5, paddingRight: 5 }}>
              {`${item.shop.shopName}`}
            </Text>
            : <Text numberOfLines={1} style={{ marginTop: 5, marginBottom: 0, textAlign: 'center', 
            paddingLeft: 5, paddingRight: 5 }}>
              {`không xác định`}
            </Text>
          }
          <View style={{
            marginBottom: 0,
            marginTop: 3,
            position: 'absolute',
            bottom: 3,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <View
              style={{ display: 'flex', flexDirection: 'row', marginLeft: 7 }}
            >
              <Text style={{ fontSize: 16, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>
              {item.productPrice}<Text style={{ fontSize: 16 }}>đ</Text></Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(PopularProductItem)

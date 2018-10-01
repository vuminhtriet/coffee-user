import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { Rating } from 'react-native-elements'
import { TEST_URL } from '../../../common/models'
import { SCREENS } from '../../screens'
import Ion from 'react-native-vector-icons/Ionicons'
import { withNavigation } from 'react-navigation'
import { getTop2ActivePrice, getFirstImgUrl } from '../../utils/productUtils'

class ProductItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      shopName: null,
    }
  }

  onPress = () => {
    const { item, navigation, onPress } = this.props
    if (onPress) {
      onPress(item)
    }
    else {
      navigation.navigate(SCREENS.ProductDetail, { productItem: item })
    }
  }

  componentDidMount() {
    const { navigation, item } = this.props
    const url = `${TEST_URL}/api/shops/${item.shopId}?filter=%7B"fields":"shopName"%7D`

    this.setState({ loading: true }, () => {
      axios({
        url,
        timeout: 5000
      })
        .then(response => {
          const shop = response.data
          this.setState({
            shopName: shop.shopName,
            loading: false
          })
        })
        .catch(e => {
          this.setState({ shopName: null })
        })
    })
    
  }

  render() {
    const { item, itemWith, itemHeight, currencyUnits } = this.props
    const { shopName } = this.state
    const { productCoverImage } = item
    // const fullUrl = getFirstImgUrl(images)
    return (
      <TouchableOpacity
        style={{
          width: itemWith,
          height: itemHeight,
          flexDirection: 'column',
          padding: 10,
          paddingBottom: 0
        }}
        onPress={this.onPress}
      >
        <View
          style={{
            padding: 5,
            borderWidth: 1,
            borderColor: '#D4D4D4',
            flex: 1
          }}
        >
          <Text
            numberOfLines={2}
            style={{ fontWeight: 'bold',fontSize: 17, marginBottom: 0, textAlign: 'left' }}
          >
            {`${item.productName}`}
          </Text>
          {shopName
            ? <Text
              numberOfLines={2}
              style={{ fontSize: 15, marginBottom: 0, textAlign: 'left' }}
            >
              {`${shopName}`}
            </Text>
            : <Text
              numberOfLines={2}
              style={{ fontSize: 15, marginBottom: 0, textAlign: 'left' }}
            >
              {`unknown`}
            </Text>
          }
          {productCoverImage
            ? <Image
              style={{ height: 155, marginTop: 10 }}
              source={{ uri: productCoverImage[0] }}
            /> : <Image
              style={{ height: 155, width: '100%' }}
              source={require('../../../assets/drinkplaceholder.png')}
            />
          }
          <View
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              bottom: 0,
              left: 0,
              right: 0,
              paddingLeft: 6,
              paddingRight: 6
            }}
          >
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={{ fontSize: 16, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>
                {item.productPrice}<Text style={{ fontSize: 16 }}>đ</Text></Text>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View>
                  <Rating
                    type='custom'
                    fractions={1}
                    startingValue={item.productTotalRating || 0}
                    readonly
                    imageSize={14}
                    showRating={false}
                    ratingImage={require('../../../assets/images/star.png')}
                    ratingColor='#FF6A00'
                    ratingBackgroundColor='transparent'
                    style={{ paddingVertical: 10 }} />
                </View>
                <View>
                  {/* <Text style={{ marginBottom: 0, paddingTop: 7, textAlign: 'left' }}>
                    {` (${item.totalUserRating || 0})`}
                  </Text> */}
                </View>
              </View>
              {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View style={{ marginTop: 1, marginRight: 2 }}>
                  {
                    item.isLike
                      ? <Ion name={'ios-heart'} style={{ paddingTop: 8, fontSize: 18, color: '#FF6A00' }} />
                      : <Ion name={'ios-heart'} style={{ paddingTop: 8, fontSize: 18, color: '#FF6A00' }} />
                  }
                </View>
                <View>
                  <Text style={{ marginBottom: 0, paddingTop: 7, textAlign: 'left' }}>
                    ({item.totalUserFavorite || 1})
                  </Text>
                </View>
              </View> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = state => ({
  currencyUnits: state['common'].units
})

export default connect(mapStateToProps)(withNavigation(ProductItem))

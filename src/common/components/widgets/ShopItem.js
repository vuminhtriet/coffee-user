import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { Rating } from 'react-native-elements'
import { SCREENS } from '../../screens'
import Ion from 'react-native-vector-icons/Ionicons'
import { withNavigation } from 'react-navigation'
import { getFirstImgUrl, getDistanceFromLatLonInKm } from '../../utils/shopUtils'

class ShopItem extends Component {
  onPress = () => {
    const { item, navigation, onPress } = this.props
    if (onPress) {
      onPress(item)
    }
    else {
        navigation.navigate(SCREENS.StoreDetail, { id: item.id, name: item.productName })
    }
  }

  render() {
    const { item, itemWith, itemHeight, latlng } = this.props
    const image = item.shopFeaturedImages && item.shopFeaturedImages[0] || ''
    // const fullUrl = getFirstImgUrl(images)
    // const {shopFeaturedImages} = item

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
            // borderWidth: 1,
            // borderColor: '#D4D4D4',
            flex: 1
          }}
        >
          {image
            ? <Image
              style={{ height: 155 }}
              source={{ uri: image }}
            /> : <Image
              style={{ height: 155, width: '100%' }}
              source={require('../../../assets/shopplaceholder.jpg')}
            />
          }
          <Text
            numberOfLines={1}
            style={{ fontWeight: 'bold',fontSize: 17, marginBottom: 0, textAlign: 'left', marginTop: 10 }}
          >
            {`${item.shopName}`}
          </Text>
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
              {item.address && item.address.fullAddress
              ? <Text numberOfLines = {2} style={{ }}>{`${item.address.fullAddress}`}</Text>
              : <Text numberOfLines = {2} style={{ }}>{`không xác định`}</Text>
              }
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Rating
                    type='custom'
                    fractions={1}
                    startingValue={item.avgRating || 0}
                    readonly
                    imageSize={14}
                    showRating={false}
                    ratingImage={require('../../../assets/images/star.png')}
                    ratingColor='#FF6A00'
                    ratingBackgroundColor='transparent'
                    style={{ paddingVertical: 10 }} />
                </View>
                {/* <View style = {{marginBottom: 7 }}> */}
                  {/* <Text style={{ marginBottom: 0, paddingTop: 7, textAlign: 'left' }}>
                    {` (${item.totalUserRating || 0})`}
                  </Text> */}
                  {item.shopLocation && item.shopLocation.lat && item.shopLocation.lng
                    ? <Text style={{fontWeight: 'bold', marginLeft: 60,
                    textAlign: 'left', marginBottom: 0, paddingTop: 7}}>
                      {`${getDistanceFromLatLonInKm(latlng.lat, latlng.lng, item.shopLocation.lat, item.shopLocation.lng)} km`} 
                    </Text>
                    : <Text style={{fontWeight: 'bold', 
                    textAlign: 'left', marginBottom: 0, paddingTop: 7}}>
                      {``} 
                    </Text>
                  }
                {/* </View> */}
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
                    ({item.totalUserRating || 1})
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

export default withNavigation(ShopItem)

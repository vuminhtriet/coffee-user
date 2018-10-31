import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { SCREENS } from '../../screens'
import { Rating } from 'react-native-elements'
import { getFirstImgUrl } from '../../utils/shopUtils'


class PopularShopItem extends Component {
  onPress = () => {
    const { navigation, item } = this.props
    navigation.navigate(SCREENS.StoreDetail, { id: item.id })
  }

  render () {
    const { item, itemWith, itemHeight } = this.props
    // const { images } = item
    // const fullUrl = getFirstImgUrl(images)
    const {shopFeaturedImages} = item

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

        <View style={{ flexDirection: 'row'}}>
          <View style= {{flexDirection: 'column'}}>
          {shopFeaturedImages
            ? <Image
              style={{ height: 124, width: 180 }}
              source={{ uri: shopFeaturedImages[0] }}
            /> : <Image
              style={{ height: 124, width: 180 }}
              source={require('../../../assets/shopplaceholder.jpg')}
            />
          }
          <Text numberOfLines = {1} style={{ fontWeight: 'bold', 
          fontSize: 17, paddingLeft: 3}}>
              {`${item.shopName}`}
          </Text>
          <View style = {{flexDirection: 'row', paddingLeft: 3}}>
            <Rating
              type='custom'
              fractions={1}
              startingValue={item.shopRating || 0}
              readonly
              imageSize={16}
              showRating={false}
              ratingImage={require('../../../assets/images/star.png')}
              ratingColor='#FF6A00'
              ratingBackgroundColor='transparent'
              style={{ paddingVertical: 10 }} />
          </View>
          <View style = {{ paddingLeft: 3}}>
          {item.address && item.address.fullAddress
              ? <Text numberOfLines = {1} style={{ }}>{`${item.address.fullAddress}`}</Text>
              : <Text numberOfLines = {1} style={{ }}>{`không xác định`}</Text>
          }
          </View>
          </View>
          <View style={{width: 20}}/>
        </View>

        {/* <View
          style={{
            borderWidth: 1,
            borderColor: '#D4D4D4',
            padding: 4,
            flex: 1
          }}
        >
          {fullUrl
            ? <Image
              style={{ height: 124, width: '100%' }}
              source={{ uri: fullUrl }}
            /> : <Image
              style={{ height: 124, width: '100%' }}
              source={{
                uri:'https://facebook.github.io/react-native/docs/assets/favicon.png'
              }}
            />
          }
          <Text numberOfLines={2} style={{ textAlign: 'center', 
          paddingLeft: 5, paddingRight: 5 }}>
            {`${item.name}`}
          </Text>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <Rating
              type='custom'
              fractions={1}
              startingValue={item.averageRatingValue || 0}
              readonly
              imageSize={14}
              showRating={false}
              ratingImage={require('../../../assets/images/star.png')}
              ratingColor='#FF6A00'
              ratingBackgroundColor='transparent'
              style={{ paddingVertical: 10 }} />
          </View>
          <View style={{
            marginBottom: 2,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <Text>no address</Text>
          </View>
        </View> */}


      </TouchableOpacity>
    )
  }
}

export default withNavigation(PopularShopItem)

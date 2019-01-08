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

class BrandItem extends Component {
  onPress = () => {
    const { item, navigation, onPress } = this.props
    if (onPress) {
      onPress(item)
    }
    else {
        navigation.navigate(SCREENS.BrandShopPage, { id: item.id, name: item.name })
    }
  }

  render() {
    const { item, itemWidth, itemHeight, latlng, totalShop } = this.props
    const image = item.brandImg  || ''
    // const fullUrl = getFirstImgUrl(images)
    // const {shopFeaturedImages} = item

    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
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
            style={{ fontWeight: 'bold',fontSize: 17, textAlign: 'left', marginTop: 10 }}
          >
            {`${item.name}`}
          </Text>
          <Text style={{textAlign: 'left',marginTop: 1}}>{`${item.shops && item.shops.length} quán cafe`}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(BrandItem)

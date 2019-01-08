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
import { getDistanceFromLatLonInKm } from '../../utils/shopUtils'


class PopularBrandItem extends Component {
  onPress = () => {
    const { navigation, item } = this.props
    navigation.navigate(SCREENS.BrandShopPage, { id: item.id, name: item.name })
  }

  render () {
    const { item, itemWith, itemHeight, latlng } = this.props
    const image = item.brandImg.length > 0 && item.brandImg || ''
    // const fullUrl = getFirstImgUrl(images)
    // const {shopFeaturedImages} = item

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
          {image
            ? <Image
              style={{ height: 124, width: 180 }}
              source={{ uri: image }}
            /> : <Image
              style={{ height: 124, width: 180 }}
              source={require('../../../assets/shopplaceholder.jpg')}
            />
          }
          <Text numberOfLines = {1} style={{ fontWeight: 'bold', 
          fontSize: 17, paddingLeft: 3}}>
              {`${item.name}`}
          </Text>
          <Text style={{textAlign: 'left',marginTop: 1, paddingLeft: 3}}>{`${item.shops && item.shops.length} quán cafe`}</Text>
          
          </View>
          <View style={{width: 20}}/>
        </View>


      </TouchableOpacity>
    )
  }
}

export default withNavigation(PopularBrandItem)

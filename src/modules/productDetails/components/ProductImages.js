import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  Image
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
const { width } = Dimensions.get('window')

const SLIDE = [
  {
    illustration: require('../../../assets/placeholder.png')
  }
]

export default class ProductImages extends Component {
  renderItem ({ item, index }) {
    return (
      <View style={{
        height: 200,
        overflow: 'visible' // for custom animations
      }}>
        {/* <Text style={{
          paddingHorizontal: 30,
          backgroundColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>{item}</Text> */}
        <Image
          source={item ? { uri: item } : require('../../../assets/drinkplaceholder.png')}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          resizeMode='contain'
        />
      </View>
    )
  }

  render () {
    const { productItem } = this.props
    const images = productItem.productCoverImage
    console.log(images)
    return (
      <View style={{ height: 200 }}>
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={!images || images.length === 0 ? SLIDE : images}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width}
        />
      </View>
    )
  }
}

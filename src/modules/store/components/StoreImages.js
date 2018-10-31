import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Image
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
const { width } = Dimensions.get('window')

export default class StoreImages extends Component {
  renderItem ({ item }) {
    if (!item) {
      return null
    }
    return (
      <View style={{
        height: 150,
        overflow: 'visible' // for custom animations
      }}>
        <Image
          source={item ? { uri: item } : require('../../../assets/shopplaceholder.jpg')}
          style={{ position: 'absolute', width: '100%', height: '100%' }} />
      </View>
    )
  }

  render () {
    const { images } = this.props
    const slideImages = images.slice(1)
    if (slideImages.length === 0) {
      return null
    }
    return (
      <View style={{ height: 150 }}>
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={slideImages}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width}
        />
      </View>
    )
  }
}

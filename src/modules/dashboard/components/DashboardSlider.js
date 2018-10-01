import React, { Component, PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  Image
} from 'react-native'
import Carousel from 'react-native-snap-carousel'

const { width } = Dimensions.get('window')
const test_images = ["https://cdn.shopify.com/s/files/1/0271/7209/files/high-end-coffee-ordering.jpg?v=1496176279","https://www.intelligentsiacoffee.com/media/wysiwyg/cms/experiences/iPhone-App-Banner-1.jpg"]
  

class SliderItem extends PureComponent {
  render() {
    return (
      <View style={{
        height: 200,
        overflow: 'visible'
      }}>
        <Text style={{
          paddingHorizontal: 30,
          backgroundColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
        </Text>
        <Image
          source={{ uri: this.props.uri }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          resizeMode='stretch' />
      </View>
    )
  }
}

class DashboardSlider extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    const { getBanners } = this.props
    getBanners()
  }

  async componentWillReceiveProps(nextProps) {
    const { refreshing, stopRefresh, getBanners } = this.props
    if (nextProps.refreshing !== refreshing && nextProps.refreshing) {
      await getBanners().catch(() => { })
      stopRefresh()
    }
  }

  renderItem = ({ item, index }) => {
    // const { images } = item
    // const uri = images[0].fullUrl
    return (
      <SliderItem
        uri={item}
      />
    )
  }

  render() {
    const { bannerData } = this.props
    
    return (
      <View style={{ height: 200 }}>
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={bannerData.length != 0 ? bannerData : test_images}
          extraData={bannerData.length != 0 ? bannerData : test_images}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width}
          autoplay
          enableMomentum={false}
          lockScrollWhileSnapping
          autoplayDelay={20000}
          autoplayInterval={10000}
          loop
        />
      </View>
    )
  }
}

export default DashboardSlider

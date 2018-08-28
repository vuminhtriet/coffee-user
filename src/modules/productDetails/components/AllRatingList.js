import React, { Component, PureComponent } from 'react'
import {
  View,
  ScrollView,
  Modal,
  Text,
  RefreshControl
} from 'react-native'
import { Rating, Slider, Card } from 'react-native-elements';
import RatingList from './RatingList';
import ProductReview from '../containers/ProductReview'
import WriteReview from '../containers/WriteReview'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import DefaultPage from '../../../common/hocs/defaultPage'
import { countRatings } from '../../../common/utils/productUtils'

const allValue = [5, 4, 3, 2, 1]

class RatingTable extends PureComponent {
  countRatings = () => {
    const { ratings } = this.props
    return countRatings(ratings)
  }

  numberOfRatings = () => {
    const { ratings } = this.props
    return ratings.length
  }

  render() {
    const { totalRatingValue, totalUserRating, ratings } = this.props
    const resultRatings = this.countRatings()
    const numberOfRatings = this.numberOfRatings()
    return (
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          flexDirection: 'row',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e6e6e6'
          // justifyContent: 'center',
          // alignItems: 'center'
        }}
      >
        {/* Value, User */}
        <View
          style={{
            width: 110,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: '#e6e6e6'
          }}>
          <Text style={{ fontSize: 18 }}>{totalUserRating > 0 ? (totalRatingValue / totalUserRating).toFixed(1) : 0}/5</Text>
          <View>
            <Rating
              type='custom'
              fractions={1}
              startingValue={totalUserRating > 0 ? (totalRatingValue / totalUserRating) : 0}
              readonly
              imageSize={16}
              showRating={false}
              ratingImage={require('../../../assets/images/star.png')}
              ratingColor='#FF6A00'
              ratingBackgroundColor='transparent'
              style={{ paddingVertical: 15 }} />
          </View>
          <Text>{totalUserRating} ratings</Text>
        </View>

        {/* Progress bar */}
        <View style={{ paddingHorizontal: 10, paddingVertical: 10, flex: 1 }}>
          {allValue.map(item => {
            const percent = numberOfRatings > 0 ? (resultRatings[item] / numberOfRatings * 100).toFixed(1) : 0
            return (
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Rating
                    type='custom'
                    fractions={1}
                    startingValue={item}
                    readonly
                    imageSize={14}
                    showRating={false}
                    ratingImage={require('../../../assets/images/star.png')}
                    ratingColor='#FF6A00'
                    ratingBackgroundColor='transparent'
                    style={{ paddingTop: 3 }} />
                </View>
                <View style={{ width: 100, paddingLeft: 15 }}>
                  <Slider
                    disabled
                    style={{ margin: 0, padding: 0, height: 24 }}
                    thumbStyle={{ width: 0, height: 0 }}
                    trackStyle={{ height: 6, backgroundColor: '#d3d3d3' }}
                    value={resultRatings[item]}
                    maximumValue={numberOfRatings}
                    minimumValue={0}
                    minimumTrackTintColor='#FF6A00'
                  />
                </View>
                <Text style={{ paddingLeft: 10 }}>{percent}%</Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

export default class AllRatingList extends PureComponent {
  state = {
    modalVisible: false,
    refreshing: false
  }
  
  componentDidMount () {
    const { getProductRatings, productId } = this.props
    getProductRatings(productId)
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  openModal = () => {
    this.setState({ modalVisible: true });
  }

  _onRefresh = async () => {
    const { getProductRatings, productId } = this.props
    this.setState({ refreshing: true })
    await getProductRatings(productId)
    this.setState({ refreshing: false })
  }

  render() {
    const { ratings, onBack, productId, images, productName, totalRatingValue, totalUserRating } = this.props
    const { modalVisible, refreshing } = this.state
    return (
      <DefaultPage style={{ flexDirection: 'row' }}>
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            onBack={onBack}
            title={'Product Rating'}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <RatingTable
              totalRatingValue={totalRatingValue}
              totalUserRating={totalUserRating}
              ratings={ratings}
            />
            <ProductReview
              onToggleWriteReview={this.openModal}
            />

            <View style={{ height: 10, backgroundColor: '#e6e6e6' }}>

            </View>

            <View style={{
              marginTop: 7,
              paddingTop: 7,
              paddingBottom: 7,
              width: '100%'
            }}>
              <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                <Text style={{ fontSize: 16 }}>All ratings ({ratings.length})</Text>
              </View>
              <RatingList ratings={ratings} mode={'all'} />
            </View>
          </ScrollView>

          {/* <ProductSubMenu
              onToggleAddToCart={this.onToggleAddToCart}
              navigation={navigation}
              shopInfo={shopInfo}
            /> */}

          <Modal
            animationType='slide'
            transparent={false}
            visible={modalVisible}
          >
            <WriteReview
              productId={productId}
              onBack={this.closeModal}
              images={images}
              productName={productName}
            />
          </Modal>
        </View>
      </DefaultPage>
    )
  }
}


import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Modal
} from 'react-native'
import { Rating, Divider } from 'react-native-elements'
import RatingList from './RatingList';
import AllRatingList from '../containers/AllRatingList';

export default class ProductRatingAndComment extends PureComponent {
  state = {
    modalVisible: false
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  openModal = () => {
    this.setState({ modalVisible: true });
  }

  render() {
    const {
      ratings,
      totalRatingValue,
      totalUserRating,
      newestRatings,
      productId,
      images,
      productName
    } = this.props
    const { modalVisible } = this.state

    return (
      <View style={{
        marginTop: 7,
        paddingTop: 7,
        paddingBottom: 7,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', height: 32 }}>
          <Text style={{ fontSize: 18, color: '#6F4E37' }}>Rating and comments</Text>
          <TouchableOpacity
            onPress={this.openModal}
            style={{
              position: 'absolute',
              zIndex: 999,
              right: 0,
              top: 0,
              width: 100,
              height: 26,
              borderRadius: 3,
              borderColor: '#6F4E37',
              borderWidth: 1,
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Text style={{ color: 'red', textAlign: 'center' }}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View>
            <Rating
              type='custom'
              fractions={1}
              startingValue={totalUserRating > 0 ? totalRatingValue / totalUserRating : 0}
              readonly
              imageSize={14}
              showRating={false}
              ratingImage={require('../../../assets/images/star.png')}
              ratingColor='#FF6A00'
              ratingBackgroundColor='transparent'
              style={{ paddingVertical: 10 }} />
          </View>
          <View>
            <Text style={{ marginBottom: 0, paddingTop: 7, textAlign: 'left' }}>
              {` ${totalUserRating > 0 ? (totalRatingValue / totalUserRating).toFixed(1) : 0}/5 (${totalUserRating || 0} ratings)`}
            </Text>
          </View>
        </View>

        <RatingList ratings={newestRatings} />

        <Modal
          animationType='slide'
          transparent={false}
          visible={modalVisible}
        >
          <AllRatingList
            ratings={ratings}
            onBack={this.closeModal}
            productId={productId}
            images={images}
            productName={productName}
            totalRatingValue={totalRatingValue}
            totalUserRating={totalUserRating}
          />
        </Modal>
      </View>
    )
  }
}

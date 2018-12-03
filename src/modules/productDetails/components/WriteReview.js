import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image
} from 'react-native'
import {
  FormInput,
  FormValidationMessage,
  Rating,
  Button
} from 'react-native-elements'
import { isEmpty } from 'lodash'
import moment from 'moment'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import StarRating from 'react-native-star-rating'

export default class WriteReview extends Component {
  constructor(props) {
    super(props)
    const { ratings, userId } = this.props
    const productRating = ratings.find(item => item.memberId === userId)
    this.state = {
      productRating,
      loading: false,
      rating: productRating ? productRating.rating : 0,
      title: productRating ? productRating.title : '',
      comment: productRating ? productRating.content : '',
      errors: {}
    }
  }

  submit = async () => {
    const { onBack, writeReview, editReview, token, productId, userId, shop, onButtonBack } = this.props
    const { rating, title, comment, productRating } = this.state
    const errors = {}
    if (rating === 0) {
      errors.rating = '* Thiếu xếp hạng'
    }
    if (!comment) {
      errors.comment = '* Thiếu bình luận'
    }
    if (!title) {
      errors.title = '* Thiếu tựa đề'
    }
    if (comment.length < 20) {
      errors.comment = '* Bình luận phải có ít nhất 20 từ'
    }
    if (comment.length > 4000) {
      errors.comment = '* Bình luận chỉ có tối đa 4000 từ'
    }

    if (!isEmpty(errors)) {
      this.setState({ errors })
      return false
    }
    else {
      const data = {
        title,
        rating: rating,
        content: comment,
        date: moment(),
        productId: productId,
        memberId: userId
      }
      if (!productRating) {
        this.setState({ loading: true }, async () => {
          await writeReview(data, token)
          this.setState({ loading: false })
          onBack()
        })
      }
      else{
        this.setState({ loading: true }, async () => {
          await editReview(data, token, productRating.id)
          this.setState({ loading: false })
          onBack()
        })
      }
    }
  }

  ratingCompleted = (rating) => {
    const { errors } = this.state
    this.setState({
      rating,
      errors: {
        ...errors,
        rating: undefined
      }
    })
  }

  onStarRatingPress = (rating) => {
    const { errors } = this.state
    this.setState({
      rating,
      errors: {
        ...errors,
        rating: undefined
      }
    })
  }

  onChangeText = (text, key) => {
    const { errors } = this.state
    this.setState({
      [key]: text,
      errors: {
        ...errors,
        [key]: undefined
      }
    })
  }

  render() {
    const { onBack, images, productName, onButtonBack } = this.props
    const { errors, rating, title, comment, loading } = this.state
    const isExistCover = images && images.length > 0 && images[0]
    const coverImage = isExistCover
      ? isExistCover
      : null
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Viết đánh giá'
            onBack={onButtonBack} />
        </View>

        {!loading && <KeyboardAvoidingView
          style={{
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff'
          }}
        >
          <ScrollView>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10, paddingLeft: 15 }}>
              <View style={{ width: 100 }}>
                <Image
                  style={{ height: 120, width: '100%' }}
                  source={coverImage
                    ? { uri: coverImage }
                    : require('../../../assets/placeholder.png')}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 15 }}>
                <Text style={{ fontWeight: 'bold', lineHeight: 20 }}>{productName}</Text>
              </View>
            </View>

            <View style={{ flex: 1, paddingBottom: 15, paddingTop: 15, alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Xếp hạng của bạn</Text>
              {/* <Rating
                // showRating
                fractions={0}
                type='custom'
                startingValue={rating}
                imageSize={40}
                onFinishRating={this.ratingCompleted}
                ratingImage={require('../../../assets/images/star.png')}
                ratingColor='#FF6A00'
                ratingBackgroundColor='transparent'
                style={{ paddingVertical: 10 }}
              /> */}
              <StarRating
                disabled={false}
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                rating={rating}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor='#E64B47'
                emptyStarColor='#E64B47'
                containerStyle={{ paddingVertical: 10 }}
                starStyle={{ paddingRight: 10 }}
              />
              {errors.rating &&
                <FormValidationMessage>{errors.rating}</FormValidationMessage>
              }
            </View>

            <View style={{ flex: 1, paddingBottom: 15 }}>
              <FormInput
                containerStyle={{ borderWidth: 1, borderColor: '#b3b3b3' }}
                placeholder='Nhập tựa đề'
                value={title || ''}
                onChangeText={(text) => this.onChangeText(text, 'title')}
              />
              {errors.title &&
                <FormValidationMessage>{errors.title}</FormValidationMessage>
              }
            </View>

            <View style={{ flex: 1, paddingBottom: 15 }}>
              <FormInput
                multiline
                numberOfLines={5}
                containerStyle={{ borderWidth: 1, borderColor: '#b3b3b3' }}
                placeholder='Nhập bình luận'
                value={comment || ''}
                onChangeText={(text) => this.onChangeText(text, 'comment')}
              />
              {errors.comment &&
                <FormValidationMessage>{errors.comment}</FormValidationMessage>
              }
            </View>

            <Button title='Đăng' onPress={this.submit} />
          </ScrollView>
        </KeyboardAvoidingView>}

        {loading && <View style={{
          justifyContent: 'center',
          padding: 10,
          alignItems: 'center',
          alignContent: 'center',
          height: '100%',
          flex: 1
        }}>
          <ActivityIndicator size="large" color="#6F4E37" />
        </View>}
      </DefaultPage>
    )
  }
}

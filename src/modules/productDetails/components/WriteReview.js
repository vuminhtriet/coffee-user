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
    this.state = {
      loading: false,
      rating: 0,
      title: '',
      comment: '',
      errors: {}
    }
  }

  submit = async () => {
    const { onBack, writeReview, token, productId, userId } = this.props
    const { rating, title, comment } = this.state
    const errors = {}
    if (rating === 0) {
      errors.rating = '* Rating required'
    }
    if (!comment) {
      errors.comment = '* Comment required'
    }
    if (comment.length < 50) {
      errors.comment = '* Comment has at least 50 characters'
    }
    if (comment.length > 4000) {
      errors.comment = '* Comment has at most 4000 characters'
    }

    if (!isEmpty(errors)) {
      this.setState({ errors })
      return false
    }
    else {
      const data = {
        title,
        value: rating,
        comment,
        status: 1,
        isVerified: true,
        createdAt: moment(),
        productId,
        userId
      }
      this.setState({ loading: true }, async () => {
        await writeReview(data, token)
        this.setState({ loading: false })
        onBack()
      })
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
    const { onBack, images, productName } = this.props
    const { errors, rating, title, comment, loading } = this.state
    const isExistCover = images && images.length > 0 && images.find(item => item.type === 2)
    const coverImage = isExistCover
      ? isExistCover
      : images.length > 0
        ? images[0]
        : null
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Write a review'
            onBack={onBack} />
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
                  source={coverImage && coverImage.fullUrl
                    ? { uri: coverImage.fullUrl }
                    : require('../../../assets/placeholder.png')}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 15 }}>
                <Text style={{ fontWeight: 'bold', lineHeight: 20 }}>{productName}</Text>
              </View>
            </View>

            <View style={{ flex: 1, paddingBottom: 15, paddingTop: 15, alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Your rating</Text>
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
                placeholder='Enter your title'
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
                placeholder='Enter your comment'
                value={comment || ''}
                onChangeText={(text) => this.onChangeText(text, 'comment')}
              />
              {errors.comment &&
                <FormValidationMessage>{errors.comment}</FormValidationMessage>
              }
            </View>

            <Button title='Submit' onPress={this.submit} />
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

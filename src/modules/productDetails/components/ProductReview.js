import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native'
import {
  Card,
  Rating
} from 'react-native-elements'
import moment from 'moment'
import { SCREENS } from '../../../common/screens'

export default class UserCartDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: []
    }
  }

  onImageUpload = (image) => {
    const images = [...this.state.images, image]
    this.setState({ images })
  }

  onPress = () => {
    const { navigation, token, onToggleWriteReview } = this.props
    token ? onToggleWriteReview : navigation.navigate(SCREENS.AuthenticatePage)
  }

  renderReview = ({ index, item }) => {
    const { user } = item
    return (
      <Card containerStyle={{ width: '97%', margin: 5 }} key={index}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Rating
            type='custom'
            //type='star'
            fractions={1}
            startingValue={item.value}
            readonly
            imageSize={14}
            showRating={false}
            ratingImage={require('../../../assets/images/star.png')}
            ratingColor='#FF6A00'
            ratingBackgroundColor='transparent'
            style={{ paddingVertical: 10 }} />
          <Text></Text>
        </View>

        {user &&
          <View style={{ flex: 1, paddingBottom: 10 }}>
            <Text>{user.displayName} - {moment(item.createdAt).format('LLL')}</Text>
          </View>
        }

        <View style={{ flex: 1, paddingBottom: 10 }}>
          <Text numberOfLines={5} ellipsizeMode='tail'>
            {item.comment}
          </Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity>
            <Text style={{ color: '#67B6F4' }}>Thanks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingLeft: 15 }}>
            <Text style={{ color: '#67B6F4' }}>Answer</Text>
          </TouchableOpacity>
        </View>
      </Card>
    )
  }

  render() {
    const { onToggleWriteReview, token, navigation } = this.props
    return (
      <View style={{
        marginTop: 7,
        paddingTop: 7,
        paddingBottom: 7,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        // backgroundColor: '#fff'
      }}>
        {this.renderUserReviews}
        {token
        ? <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center'
            }}
            onPress={onToggleWriteReview}
          >
            <Text style={{ fontSize: 16, color: '#67B6F4', fontWeight: 'bold' }}>Viết đánh giá</Text>
          </TouchableOpacity>
        : <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center'
            }}
            onPress={this.onPress}
          >
            <Text style={{ fontSize: 16, color: '#67B6F4', fontWeight: 'bold' }}>Viết đánh giá</Text>
          </TouchableOpacity>}
      </View>
    )
  }
}

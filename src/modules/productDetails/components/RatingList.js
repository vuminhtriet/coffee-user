import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Icon
} from 'react-native'
import { Rating, Divider } from 'react-native-elements'
import moment from 'moment';
import Ion from 'react-native-vector-icons/Ionicons'

class RatingItem extends PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    if (this.props.mode === "all") {
      return (
        <View style={{ paddingBottom: 10, paddingHorizontal: 15 }}>
          <Divider />
          <View style={{ paddingVertical: 10 }}>
            {/* Rating value, Rating title */}
            <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
              <View>
                <Rating
                  type='custom'
                  fractions={1}
                  startingValue={this.props.value || 0}
                  readonly
                  imageSize={14}
                  showRating={false}
                  ratingImage={require('../../../assets/images/star.png')}
                  ratingColor='#FF6A00'
                  ratingBackgroundColor='transparent'
                  style={{ paddingBottom: 10, paddingTop: 3 }} />
              </View>
              <Text style={{ fontSize: 16, paddingLeft: 15 }}>{this.props.title}</Text>
            </View>

            {/* Display name - CreatedAt */}
            <View style={{ paddingBottom: 5 }}>
              <Text style={{ color: '#adc0d1' }}>{this.props.displayName} - {moment(this.props.createdAt).format('LLL')}</Text>
            </View>

            {/* IsVerified */}
            {/* {this.props.isVerified && <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
              <View>
                <Ion name={'ios-checkmark-circle-outline'} size={20} color={'#6F4E37'} />
              </View>
              <View>
                <Text style={{ paddingLeft: 10 }}>purchased</Text>
              </View>
            </View>} */}

            <View>
              <Text style={{ paddingBottom: 10, lineHeight: 24 }}>{this.props.comment}</Text>
            </View>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={{ paddingBottom: 10 }}>
          <Divider />

          {/* Rating */}
          <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
            {/* Avatar */}
            <View style={{ width: 60 }}>
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: this.props.uri }}
              />
            </View>

            {/* Display name, Rating value, Rating comment, CreatedAt */}
            <View style={{ flex: 1 }}>
              <Text>{this.props.displayName}</Text>
              <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
                <View>
                  <Rating
                    type='custom'
                    fractions={1}
                    startingValue={this.props.value || 0}
                    readonly
                    imageSize={14}
                    showRating={false}
                    ratingImage={require('../../../assets/images/star.png')}
                    ratingColor='#FF6A00'
                    ratingBackgroundColor='transparent'
                    style={{ paddingBottom: 10, paddingTop: 3 }} />
                </View>
                <Text style={{ fontSize: 16, paddingLeft: 15 }}>{this.props.title}</Text>
              </View>
              <Text style={{ paddingBottom: 10, lineHeight: 24 }}>{this.props.comment}</Text>
              <Text style={{ color: '#adc0d1' }}>{moment(this.props.createdAt).format('LLL')}</Text>
            </View>

            {/* IsVerified */}
            {/* {this.props.isVerified && <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ paddingLeft: 5 }}>
                <Ion name={'ios-checkmark-circle-outline'} size={20} color={'#6F4E37'} />
              </View>
              <View>
                <Text style={{ paddingLeft: 10 }}>purchased</Text>
              </View>
            </View>} */}
          </View>
        </View>
      );
    }
  }
}

export default class RatingList extends PureComponent {
  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return { selected };
    });
  };

  _renderItem = ({ item }) => (
    <RatingItem
      id={item.id}
      onPressItem={this._onPressItem}
      mode={this.props.mode}
      displayName={item.member && item.member.displayName || "unknown"}
      value={item.rating}
      title={item.title || ""}
      comment={item.content}
      createdAt={item.date}
      // isVerified={item.isVerified}
      uri={item.member && item.member.userPhoto && item.member.userPhoto.length > 0 ? item.member.userPhoto 
        : 'https://qualiscare.com/wp-content/uploads/2017/08/default-user.png'}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.ratings}
        extraData={this.props.ratings}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    )
  }
}

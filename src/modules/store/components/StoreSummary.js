import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import moment from 'moment'
import { Rating } from 'react-native-elements'

export default class StoreSummary extends Component {
  render () {
    const { shop } = this.props
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
        <Text style={{ fontSize: 16, paddingBottom: 3, color: '#000', fontWeight: 'bold' }}>
          Tổng kết
        </Text>
        <View style={{ paddingLeft: 10 }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>
              <Text style={{ color: '#212121' }}>Số lượng đồ uống:</Text> {shop.products.length}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>
              <Text style={{ color: '#212121' }}>Phong cách quán:</Text> {shop.styleName ?
               shop.styleName : ""}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>
              <Text style={{ color: '#212121' }}>Thương hiệu:</Text> {shop.brand && shop.brand.name ?
               shop.brand.name : ""}
            </Text>
          </View>
          {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>
              <Text style={{ color: '#212121' }}>Thời gian trả lời:</Text> {shop.responseRate}
            </Text>
          </View> */}
          {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>
              <Text style={{ color: '#212121' }}>Major:</Text> Cloths, etc.
            </Text>
          </View> */}
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, lineHeight: 26, fontSize: 14, color: '#212121' }}>
              Đánh giá:
            </Text>
            <View>
              <Rating
                type='custom'
                fractions={1}
                startingValue={shop.avgRating || 0}
                readonly
                imageSize={14}
                showRating={false}
                ratingImage={require('../../../assets/images/star.png')}
                ratingColor='#FF6A00'
                ratingBackgroundColor='transparent'
                style={{ paddingTop: 10 }} />
            </View>
            <View>
              <Text style={{ marginBottom: 0, paddingTop: 7, paddingLeft: 5, textAlign: 'left', color: '#b5b5b5' }}>
                {` ${shop.avgRating || 0}/5 (${shop.numRating || 0} đánh giá)`}
              </Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ paddingRight: 10, color: '#b5b5b5', lineHeight: 26, fontSize: 14 }}>
              <Text style={{ color: '#212121' }}>Tham gia:</Text> {shop.dateCreatedAt ? moment(shop.dateCreatedAt).format('DD-MM-YYYY') : ''}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

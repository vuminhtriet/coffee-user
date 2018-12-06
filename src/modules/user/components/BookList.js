import React, { Component, PureComponent } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native'
import { Card, Button } from 'react-native-elements'
import {
  ORDER_STATUS,
  ORDER_STATUS_MAP,
  SHIPPING_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  PAYMENT_STATUS
} from '../../../common/models'
import moment from 'moment'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 280

class OrderItem extends PureComponent {
  render() {
    const {
      id,
      itemWidth,
      itemPress,
      itemHeight,
      item
    } = this.props
    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          height: itemHeight,
          flexDirection: 'column',
          padding: 10,
          paddingBottom: 0
        }}
        onPress={() => itemPress(id)}
      >

        <View
          style={{
            padding: 5,
            // borderWidth: 1,
            // borderColor: '#D4D4D4',
            flex: 1
          }}
        >
          {item.shop && item.shop.shopFeaturedImages && item.shop.shopFeaturedImages.length > 0
            ? <Image
              style={{ height: 155 }}
              source={{ uri: item.shop.shopFeaturedImages[0] }}
            /> : <Image
              style={{ height: 155, width: '100%' }}
              source={require('../../../assets/shopplaceholder.jpg')}
            />
          }
          <Text
            numberOfLines={1}
            style={{ fontWeight: 'bold',fontSize: 17, marginBottom: 0, textAlign: 'left', marginTop: 10 }}
          >
            {`${item.shop.shopName}`}
          </Text>
          <View
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              bottom: 0,
              left: 0,
              right: 0,
              paddingLeft: 6,
              paddingRight: 6
            }}
          >
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              {/* {item.shop && item.shop.address && item.shop.address.fullAddress
              ? <Text numberOfLines = {2} style={{ }}>{`${item.shop.address.fullAddress}`}</Text>
              : <Text numberOfLines = {2} style={{ }}>{`không xác định`}</Text>
              } */}
              {item.orderTime
              ? <Text numberOfLines = {2} style={{ }}>{`${moment(item.orderTime).format('lll')}`}</Text>
              : <Text numberOfLines = {2} style={{ }}>{`không xác định`}</Text>
              }
              {item.orderCode
              ? <Text numberOfLines = {2} style={{ }}>{`Mã đặt: ${item.orderCode}`}</Text>
              : <Text numberOfLines = {2} style={{ }}>{`không xác định`}</Text>
              }
              {item.status === 0 &&
                <Text numberOfLines = {1} style={{alignContent: 'flex-end', fontWeight: 'bold'
                    , alignItems: 'flex-end', justifyContent: 'flex-end', fontSize: 18, color: '#E0C4BE'}}>
                    {`Chờ xác nhận`} 
                    </Text>}
                {item.status === 1 &&
                <Text numberOfLines = {1} style={{alignContent: 'flex-end', fontWeight: 'bold'
                    , alignItems: 'flex-end', justifyContent: 'flex-end', fontSize: 18, color: 'red'}}>
                    {`Đã hủy`} 
                    </Text>}
                {item.status === 2 &&
                <Text numberOfLines = {1} style={{alignContent: 'flex-end', fontWeight: 'bold'
                    , alignItems: 'flex-end', justifyContent: 'flex-end', fontSize: 18, color: 'green'}}>
                    {`Đã xác nhận`} 
                    </Text>}
                {item.status === 3 &&
                <Text numberOfLines = {1} style={{alignContent: 'flex-end', fontWeight: 'bold'
                    , alignItems: 'flex-end', justifyContent: 'flex-end', fontSize: 18, color: 'green'}}>
                    {`Kết thúc`} 
                    </Text>}
            </View>
          </View>
        </View>


      </TouchableOpacity>
    )
  }
}

export default class BookList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      itemWidth: 140
    }
  }

  onRefresh = () => {
    const { onRefresh } = this.props
    onRefresh && onRefresh()
  }

  onLoadMore = () => {

  }

  _keyExtractor = (item, index) => item.id;

  renderItem = ({ item }) => {
    const { itemPress } = this.props
    const { itemWidth } = this.state
    const id = item.id
    
    return (
      // <Card
      //   containerStyle={{ width: itemWidth, margin: 5 }}
      // >
      //   <View
      //     style={{
      //       position: 'absolute',
      //       zIndex: 999,
      //       right: -10,
      //       top: 0,
      //       width: 140,
      //       height: 60
      //     }}
      //   >
      //     <Button
      //       backgroundColor='green'
      //       onPress={() => itemPress(id)}
      //       buttonStyle={{ padding: 5, borderRadius: 5, paddingHorizontal: 10 }}
      //       // icon={{ name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 } }}
      //       title='View'
      //     />
      //   </View>
      //   <View style={{ flexDirection: 'column' }}>
      //     <Text
      //       style={{
      //         marginBottom: 0,
      //         textAlign: 'left',
      //         fontWeight: 'bold',
      //         paddingRight: 120,
      //         paddingBottom: 5
      //       }}
      //     >
      //       {`${item.title}`}
      //     </Text>
      //     <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       {`OrderID: ${item.id ? item.id : 'N/A'}`}
      //     </Text>
      //     <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       {`Date: ${moment(item.orderCreatedAt).format('LLL')}`}
      //     </Text>
      //     {(isUser && item.shop) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       Sold by:
      //       <Text style={{ color: '#67B6F4' }}>
      //         {` ${item.shop.name || ''}`}
      //       </Text>
      //     </Text>}
      //     {(!isUser && item.user) && <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       Customer:
      //       <Text style={{ color: '#67B6F4' }}>
      //         {` ${item.user.displayName || ''}`}
      //       </Text>
      //     </Text>}
      //     <Text style={{ marginLeft: 5, textAlign: 'left', paddingBottom: 5 }}>
      //       {`Total amount: ${item.totalAmount} (${item.totalItem} items)`}
      //     </Text>
      //     <Text style={{
      //       marginLeft: 5,
      //       textAlign: 'left',
      //       paddingBottom: 5,
      //       color: item.orderStatus === ORDER_STATUS.IN_PROGRESS
      //         ? 'red'
      //         : item.orderStatus === ORDER_STATUS.COMPLETE
      //           ? 'green' : undefined
      //     }}>
      //       <Text style={{ marginBottom: 0, textAlign: 'left', fontWeight: 'bold', color: '#000' }}>
      //         Status:
      //       </Text>
      //       {` ${orderStatus}`}
      //       <Text style={{ color: '#000' }}>
      //         {` (${shippingStatus}, ${paymentStatus})`}
      //       </Text>
      //     </Text>
      //   </View>
      // </Card >

      <OrderItem
        id={item.id}
        itemWidth={ITEM_WITDH}
        itemHeight={ITEM_HEIGHT}
        item={item}
        itemPress={itemPress}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const { data } = this.props
    return (
      <FlatList
        data={data}
        numColumns={2}
        refreshing={refreshing}
        extraData={data}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        onEndReached={this.onLoadMore}
        onEndReachedThreshold={1}
        removeClippedSubviews
      />
    )
  }
}

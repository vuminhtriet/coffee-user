import React, { Component, PureComponent } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert
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
const NUMBER_OF_ITEM = 1
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 130

class OrderItem extends PureComponent {

  render() {
    const {
      id,
      itemWidth,
      itemPress,
      itemHeight,
      item,
      updateOrder
    } = this.props
    let status = ''
    if(item.status === 0) {
      status = 'Chờ xác nhận'
    }
    else if(item.status === 1){
      status = 'Đã hủy'
    }
    else if(item.status === 2){
      status = 'Đã xác nhận'
    }
    else if(item.status === 3){
      status = 'Kết thúc'
    }

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

        <View style={{ flexDirection: 'row',
          padding: 5, alignContent: 'center', alignItems: 'center',
          flex: 1, justifyContent: 'space-between' }}>
          <View style= {{flexDirection: 'column'}}>

          <Text numberOfLines = {1} style={{ fontWeight: 'bold',
          fontSize: 17}}>
              {`${item.customerName}`}
          </Text>
          <Text numberOfLines = {1} style={{ }}>{`SĐT: ${item.customerPhone}`}</Text>
          <Text numberOfLines = {2} style={{ }}>
          {`Ngày đặt: ${moment(item.orderTime).format('DD-MM-YYYY HH:mm')}`}</Text>
          <Text numberOfLines = {2} style={{ }}>
          {`Ngày tạo: ${moment(item.dateCreatedAt).format('DD-MM-YYYY HH:mm')}`}</Text>

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
            {/* {item.status === 0 &&
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
              </Text>} */}
              {item.status === 0 &&
              <View
                style={{
                  margin: 0,
                  width: undefined,
                  height: undefined
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    // marginTop: 10,
                    flexDirection: 'column',
                    // alignItems: 'center'
                  }}>
                  {/* <View style={{ height: 10 }}> */}
                    <Button 
                    buttonStyle={{ marginTop: 10,height: 35 }}
                    title='Hủy đơn' 
                    onPress={() => updateOrder(item.id, 1)} />
                  {/* </View> */}
                  {/* <View style={{ height: 10, marginTop: 5 }}> */}
                    <Button
                      title='Xác nhận'
                      onPress={() => updateOrder(item.id, 2)}
                      backgroundColor='#E44C4C'
                      buttonStyle={{ marginTop: 10, height: 35 }}
                    />
                  {/* </View> */}
                </View>
              </View>}

              {/* {item.status === 1 &&
              <View
                style={{
                  margin: 0,
                  width: undefined,
                  height: undefined
                }}>
                <View
                  style={{
                    width: undefined,
                    height: 60,
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <View style={{ flex: 1 }}>
                    <Button title='Đơn đã bị hủy' 
                    disable={true} />
                  </View>
                </View>
              </View>} */}

              {item.status === 2 &&
              <View
                style={{
                  margin: 0,
                  width: undefined,
                  height: undefined
                }}>
                <View
                  style={{
                    width: undefined,
                    height: 100,
                    // marginTop: 10,
                    flexDirection: 'column',
                    // alignItems: 'center'
                  }}>
                  {/* <View style={{ width: 50, height: 50 }}> */}
                    <Button 
                    buttonStyle={{ marginTop: 10, height: 35 }}
                    title='Hủy đơn' onPress={() => updateOrder(item.id, 1)} />
                  {/* </View> */}
                  {/* <View style={{ width: 50, height: 50 }}> */}
                    <Button
                      title='Xác nhận đã tới'
                      onPress={() => updateOrder(item.id, 3)}
                      buttonStyle={{ marginTop: 10, height: 35 }}
                      backgroundColor='#E44C4C'
                    />
                  {/* </View> */}
                </View>
              </View>}

              {/* {item.status === 3 &&
              <View
                style={{
                  margin: 0,
                  width: undefined,
                  height: undefined
                }}>
                <View
                  style={{
                    width: undefined,
                    height: 60,
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <View style={{ flex: 1 }}>
                    <Button title='Đã tới - kết thúc đơn' 
                    disable={true} />
                  </View>
                </View>
              </View>} */}
        </View>
        <View style={{marginTop: 12, width: '100%', height: 1, backgroundColor: '#DCDCDC'}}/>

      </TouchableOpacity>
    )
  }
}

export default class BookList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      itemWidth: 170,
      loading: false
    }
  }

  updateOrder = async (id, status) => {
    const { updateOrder, token, getOrders } = this.props
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn cập nhật lại tình trạng đơn?',
      [
        { text: 'Hủy', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
              const response = await updateOrder(id, status, token)
              if (response) {
                await getOrders()
                this.setState({ loading: false })
              }
          }
        }
      ],
      { cancelable: false }
    )
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
        updateOrder={this.updateOrder}
      />
    )
  }

  render() {
    const { refreshing } = this.state
    const { data } = this.props
    return (
      <FlatList
        data={data}
        // numColumns={2}
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

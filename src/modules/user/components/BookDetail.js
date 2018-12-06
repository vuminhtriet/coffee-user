import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image
} from 'react-native'
import {
  Card,
  FormLabel,
  FormInput,
  Button,
  FormValidationMessage
} from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import {
  SHIPPING_STATUS,
  PAYMENT_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_MAP
} from '../../../common/models';
import { mapSeries } from 'async';
import { uploadProofImage } from '../../../common/firebase'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'

export default class BookDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      loading: true,
      refreshing: false
    }
  }

  async componentDidMount() {
    const { getOrderDetail, id, token, onBack, getOrders } = this.props
    id && token && await getOrderDetail(id, token)
    // const { order } = this.props
    // if (order.orderStatus <= 0) {
    //   await getOrders()
    //   this.setState({ loading: false })
    //   onBack()
    // }
    // else {
    //   this.setState({ loading: false })
    // }
    this.setState({ loading: false })
  }

  onRefresh = () => {
    const { getOrderDetail, id, token, onBack, getOrders } = this.props
    this.setState({
      refreshing: true,
      loading: true
    }, async () => {
      await getOrderDetail(id, token)
      // const { order } = this.props
      // if (order.orderStatus <= 0) {
      //   await getOrders()
      //   this.setState({
      //     refreshing: false,
      //     loading: false
      //   })
      //   onBack()
      // }
      // else {
      //   this.setState({
      //     refreshing: false,
      //     loading: false
      //   })
      // }
      this.setState({
        refreshing: false,
        loading: false
      })
    })
  }

  deleteOrder = async () => {
    const { deleteOrder, token, onBack, getOrders, id } = this.props
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn xóa đơn?',
      [
        { text: 'Hủy', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
              const response = await deleteOrder(id)
              if (response) {
                await getOrders()
                this.setState({ loading: false })
                onBack()
              }
          }
        }
      ],
      { cancelable: false }
    )
  }

  render() {
    const { order, isUser, onBack } = this.props
    const { images, loading, refreshing } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Chi tiết đơn'
            onBack={onBack} />
        </View>

        {!loading &&
          <View style={{ flex: 1 }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  title='Loading...'
                />
              }
            >
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#E64B47', marginLeft: 15, 
            marginTop: 15 }}>
            {order.shop.shopName}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 15 }}>
            {order.shop.address && order.shop.address.fullAddress}</Text> 
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 15, marginBottom: 12 }}>
            {order.shop.shopPhoneNumber}</Text>
            {/* <Image
                source={
                  !cover
                    ? require('../../../assets/banner/Banner4.jpg')
                    : { uri: cover }
                }
                style={{ width: '100%', height: 150, marginBottom: 12 }}
                resizeMode='cover'
            /> */}
            {order.shop && order.shop.shopFeaturedImages && order.shop.shopFeaturedImages.length > 0
            ? <Image
              style={{ width: '100%', height: 150, marginBottom: 12 }}
              source={{ uri: order.shop.shopFeaturedImages[0] }}
              resizeMode='cover'
            /> : <Image
              style={{ width: '100%', height: 150, marginBottom: 12 }}
              source={require('../../../assets/shopplaceholder.jpg')}
              resizeMode='cover'
            />
            }

          <View style={{ display: 'flex', flexDirection: 'column', marginLeft: 15 }}>
            <View style={{ display: 'flex', flexDirection: 'row',
          alignContent: 'center', alignItems: 'center' }}>
              <Icon
                name={'ios-checkmark-circle'}
                // type="entypo"
                size={40}
                style={{
                marginTop: 5,
                marginRight: 6,
                marginLeft: 2,
                color: 'green'
                }}
              />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Đã đặt
                </Text>
            </View>
              <Text style={{ fontSize: 14, marginLeft: 48 }}>
              {'Mã đặt là ' + order.orderCode + ' cho ' + order.customerAmount + 
              ' người vào lúc ' + moment(order.orderTime).format('lll')}
              {/* {JSON.stringify(order) || ''} */}
              </Text> 
          </View>

            { order.status === 0 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-close-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Chờ xác nhận
                </Text>
            </View>
            }

            { order.status === 1 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-close-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2,
                    color: 'red'
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Đã hủy
                </Text>
            </View>
            }

            { order.status === 2 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-checkmark-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2,
                    color: 'green'
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Đã xác nhận
                </Text>
            </View>
            }

            { order.status === 3 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-checkmark-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2,
                    color: 'green'
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Đã xác nhận
                </Text>
            </View>
            }

            { order.status === 1 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-checkmark-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2,
                    color: 'green'
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Kết thúc (đơn bị hủy)
                </Text>
            </View>
            }

            { order.status === 2 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-close-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Chờ khách tới
                </Text>
            </View>
            }

            { order.status === 3 &&
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10,
            alignContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                <Icon
                    name={'ios-checkmark-circle'}
                    // type="entypo"
                    size={40}
                    style={{
                    marginTop: 5,
                    marginRight: 6,
                    marginLeft: 2,
                    color: 'green'
                    }}
                />
                <Text style={{ fontWeight: 'bold', paddingLeft: 10, fontSize: 18 }}>
                Kết thúc (khách đã tới)
                </Text>
            </View>
            }

          {order.status === 1 && 
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
                <Button title='Xóa đơn' onPress={this.delete} />
              </View>
              {/* <View style={{ flex: 1 }}>
                <Button
                  title='Đặt bàn'
                  onPress={this.submit}
                  backgroundColor='#E44C4C'
                />
              </View> */}
            </View>
          </View> }

          {order.status === 3 && 
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
                <Button title='Xóa đơn' onPress={this.delete} />
              </View>
              {/* <View style={{ flex: 1 }}>
                <Button
                  title='Đặt bàn'
                  onPress={this.submit}
                  backgroundColor='#E44C4C'
                />
              </View> */}
            </View>
          </View> }

            </ScrollView>
          </View>
        }
      </DefaultPage>
    )
  }
}

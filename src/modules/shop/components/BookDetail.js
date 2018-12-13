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
  Icon,
  Card,
  FormLabel,
  FormInput,
  Button,
  FormValidationMessage
} from 'react-native-elements'
import Details from './Details'
import General from './General'
import ShippingInfo from './ShippingInfo'
import Delivery from './Delivery'
import AdditionalFees from './AdditionalFees'
import PaymentMethods from './PaymentMethods'
import UserNote from './UserNote'
import ShopNote from './ShopNote'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubMenu from '../containers/SubMenu';
import {
  SHIPPING_STATUS,
  PAYMENT_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_MAP
} from '../../../common/models';
import { mapSeries } from 'async';
import { uploadProofImage } from '../../../common/firebase'
import moment from 'moment'

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

  updateOrder = async (id, status) => {
    const { updateOrder, token, onBack, getOrders } = this.props
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
              <Card
                containerStyle={{
                  margin: 0,
                  width: undefined,
                  height: undefined
                }}>

                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  {/* Avatar */}
                  <View style={{ width: 120 }}>
                    <Image
                      style={{ width: 100, height: 100 }}
                      source={{ uri: 
                        order.member && order.member.userPhoto && order.member.userPhoto.length > 0 ? 
                        order.member.userPhoto: 
                        'https://qualiscare.com/wp-content/uploads/2017/08/default-user.png' }}
                    />
                  </View>

                  {/* Display name */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, marginBottom: 7 }}>
                    {'Người tạo: '}</Text>  
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>{order.member.displayName}</Text>
                  </View>
                </View>

                <FormLabel>
                  Tên người đặt
                </FormLabel>
                <Text style={{ fontSize: 16, marginTop: 7, marginLeft: 20 }}>
                {order.customerName}</Text>   

                <FormLabel>
                  Thời gian đặt
                </FormLabel>
                <Text style={{ fontSize: 16, marginTop: 7, marginLeft: 20 }}>
                {moment(order.orderTime).format('lll')}</Text>  

                <FormLabel>
                  Số lượng người
                </FormLabel>
                <Text style={{ fontSize: 16, marginTop: 7, marginLeft: 20 }}>
                {order.customerAmount}</Text>  

                <FormLabel>
                  Email
                </FormLabel>
                <Text style={{ fontSize: 16, marginTop: 7, marginLeft: 20 }}>
                {order.customerEmail}</Text>  

                <FormLabel>
                  Số điện thoại
                </FormLabel>
                <Text style={{ fontSize: 16, marginLeft: 7, marginLeft: 20 }}>
                {order.customerPhone}</Text> 

                <FormLabel>
                  Mã đặt
                </FormLabel>
                <Text style={{ fontSize: 16, marginLeft: 7, marginLeft: 20 }}>
                {order.orderCode}</Text>

                <FormLabel>
                  Trạng thái đơn
                </FormLabel>
                {order.status === 0 &&
                <Text style={{ fontSize: 16, marginLeft: 7, marginLeft: 20 }}>
                {'Đang chờ xác nhận'}</Text> 
                }
                {order.status === 1 &&
                <Text style={{ fontSize: 16, marginLeft: 7, marginLeft: 20 }}>
                {'Đã hủy'}</Text> 
                }
                {order.status === 2 &&
                <Text style={{ fontSize: 16, marginLeft: 7, marginLeft: 20 }}>
                {'Chờ khách tới'}</Text> 
                }
                {order.status === 3 &&
                <Text style={{ fontSize: 16, marginLeft: 7, marginLeft: 20 }}>
                {'Đơn đã kết thúc'}</Text> 
                }

              </Card>

              {order.status === 0 &&
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
                    <Button title='Hủy đơn' onPress={() => this.updateOrder(order.id, 1)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      title='Xác nhận'
                      onPress={() => this.updateOrder(order.id, 2)}
                      backgroundColor='#E44C4C'
                    />
                  </View>
                </View>
              </View>}

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
                    <Button title='Đơn đã bị hủy' 
                    disable={true} />
                  </View>
                </View>
              </View>}

              {order.status === 2 &&
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
                    <Button title='Hủy đơn' onPress={() => this.updateOrder(order.id, 1)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      title='Xác nhận khách tới'
                      onPress={() => this.updateOrder(order.id, 3)}
                      backgroundColor='#E44C4C'
                    />
                  </View>
                </View>
              </View>}

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
                    <Button title='Khách đã tới - kết thúc đơn' 
                    disable={true} />
                  </View>
                </View>
              </View>}

            </ScrollView>
          </View>
        }
      </DefaultPage>
    )
  }
}

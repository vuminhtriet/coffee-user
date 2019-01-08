import moment from 'moment'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  Animated,
  Image,
  RefreshControl
} from 'react-native'
import QRCode from 'react-native-qrcode'
import Icon from 'react-native-vector-icons/Ionicons'
import { TEST_URL } from '../../../common/models'
import axios from 'axios'
import DatePicker from 'react-native-datepicker'
import MultiSelect from '../../../libraries/components/MultipleSelect'
import { Dropdown } from 'react-native-material-dropdown'
import {
  Card,
  FormLabel,
  FormInput,
  Button,
  FormValidationMessage
} from 'react-native-elements'
import { isEmpty } from 'lodash'


export default class BookConfirm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shop: {},
      order: {},
      refreshing: false,
      loading: true
    }
    this.delete = this.delete.bind(this)
  }

  componentDidMount(){
    const { getShopDetail, memberId, shopId } = this.props
    // const { } = this.state
    getShopDetail(shopId, memberId)
  }

  onRefresh = () => {
    const { getShopDetail, memberId, shopId } = this.props
    this.setState({
      refreshing: true,
      loading: true
    }, async () => {
      await getShopDetail(shopId, memberId)
      this.setState({
        refreshing: false,
        loading: false
      })
    })
  }

  updateOrder = async (status) => {
    const { updateOrder, token, order, navigation } = this.props
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn hủy đơn?',
      [
        { text: 'Thoát', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
              const response = await updateOrder(order.id, status, token)
              if (response) {
                this.setState({ loading: false })
                return navigation.goBack()
              }
          }
        }
      ],
      { cancelable: false }
    )
  }

  delete () {
    const { deleteOrder, navigation, shop, order } = this.props
    // const { shop, order } = this.state
    try {
      const request = deleteOrder(order.id)
      if(request){
        return navigation.goBack()
      }
      else{
        return Alert.alert(
          'KHÔNG THỂ XÓA',
          'Lỗi từ server',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
          ],
          { cancelable: false }
        )
      }
    } catch (error) {
      return Alert.alert(
        'KHÔNG THỂ XÓA',
        'Lỗi từ server',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        { cancelable: false }
      )
    }
  }

  render () {
    const { refreshing, loading } = this.state
    const { navigation, shop, order } = this.props
    const cover = shop && shop.shopFeaturedImages ? shop.shopFeaturedImages[0] : null

    return (
        <View style={{ flex: 1 }}>
        <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  title='Loading...'
                />
              }
              ref='scrollView'
              // onContentSizeChange={(width, height) => errors.length > 0 && this.refs.scrollView.scrollTo({ y: height })}
            >
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#E64B47', marginLeft: 15, 
            marginTop: 15 }}>
            {shop.shopName}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 15 }}>
            {shop.address && 
              `${shop.address.fullAddress}, ${isNaN(shop.address.districtName) ? '' : 'Quận '}${shop.address.districtName 
              || ''}, ${shop.address.cityName || ''}`}</Text> 
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 15, marginBottom: 12 }}>
            {shop.shopPhoneNumber}</Text>
            <Image
                source={
                  !cover
                    ? require('../../../assets/banner/Banner4.jpg')
                    : { uri: cover }
                }
                style={{ width: '100%', height: 150, marginBottom: 12 }}
                resizeMode='cover'
            />

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
              {'Mã đặt là ' + order.orderCode.toUpperCase() + ' cho ' + order.customerAmount + 
              ' người vào lúc ' + moment(order.orderTime).format('DD-MM-YYYY HH:mm')}
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
                Kết thúc (đã tới)
                </Text>
            </View>
            }

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
                <Button title='Hủy đơn' onPress={() => this.updateOrder(1)} />
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
                <Button title='Tạo đơn mới' onPress={this.delete} />
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
                <Button title='Hủy đơn' onPress={() => this.updateOrder(1)} />
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
                <Button title='Tạo đơn mới' onPress={this.delete} />
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
    )
  }
}

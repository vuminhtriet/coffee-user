import moment from 'moment'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text
} from 'react-native'
import QRCode from 'react-native-qrcode'
import { TEST_URL } from '../../../common/models'
import axios from 'axios'
import DatePicker from 'react-native-datepicker'
import MultiSelect from '../../../libraries/components/MultipleSelect'
import { Dropdown } from 'react-native-material-dropdown'
import {
  Icon,
  Card,
  FormLabel,
  FormInput,
  Button,
  FormValidationMessage
} from 'react-native-elements'
import { isEmpty } from 'lodash'


export default class BookDetail extends Component {
  constructor (props) {
    super(props)
    const { user } = props
    this.state = {
      displayName: user.displayName || '',
      amount: 0,
      dateTime: null,
      email: user.email || '',
      phone: '',
      errors: {},
      qrcode: null
    }
    this.submit = this.submit.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
  }

  componentDidMount(){
    const { selectedCity } = this.state
    if (selectedCity){
      this.getDistrictInCity(selectedCity)
    }
  }

  submit () {
    const { token, bookTable, user, navigation, shop } = this.props
    const { displayName, phone, email, amount, dateTime } = this.state
    const errors = {}
    // return Alert.alert(
    //   'CANT LOG IN',
    //   JSON.stringify(gender),
    //   [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')}
    //   ],
    //   { cancelable: false }
    // )
    if (!displayName) {
      errors.displayName = '* Thiếu tên hiển thị'
    }
    if (!dateTime) {
        errors.dateTime = '* Thời gian đặt trước ít nhất 1 ngày'
    }
    if (amount <= 0) {
        errors.amount = '* Số lượng người ít nhất là 1'
    }
    if (!phone) {
      errors.phone = '* Thiếu số điện thoại'
    }
    if (!email) {
      errors.email = '* Thiếu email'
    }

    if (!isEmpty(errors)) {
      this.setState({ errors })
    } else {
      try {
        const request = bookTable(token,
          {id: user.id,
          dateTime,
          amount,
          shopId: shop.id},
          {displayName,
            phone,
            email}
        )
        if(request){
          return Alert.alert(
            'ĐẶT BÀN THÀNH CÔNG',
            'Vui lòng nhấn lại phần đặt chỗ để xem trạng thái.',
            [
              {text: 'OK', onPress: () => navigation.goBack()}
            ],
            { cancelable: false }
          )
        }
        else{
          return Alert.alert(
            'KHÔNG THỂ ĐẶT BÀN',
            'Lỗi từ server',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')}
            ],
            { cancelable: false }
          )
        }
      } catch (error) {
        return Alert.alert(
          'KHÔNG THỂ ĐẶT BÀN',
          'Lỗi từ server',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
          ],
          { cancelable: false }
        )
      }
    }
  }

  componentWillReceiveProps (nextProp) {
    const { user } = this.props
    if (nextProp.user && JSON.stringify(user) !== JSON.stringify(nextProp.user)) {
      this.setState({
        displayName: nextProp.user.displayName || '',
        email: nextProp.user.email || '',
        amount: 0,
        dateTime: null,
        phone: '',
        errors: {},
      })
    }
  }

  onChangeValue(selectedItem, value){
    const { errors } = this.state
    this.setState({ 
      [selectedItem]: value,
      errors: {
        ...errors,
        [selectedItem]: undefined
      }
    })
    // return Alert.alert(
    //   'CANT LOG IN',
    //   JSON.stringify(value),
    //   [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')}
    //   ],
    //   { cancelable: false }
    // )
  }

  onChangeText (text, field) {
    const { errors } = this.state
    this.setState({
      [field]: text,
      errors: {
        ...errors,
        [field]: undefined
      }
    })
    // return Alert.alert(
    //   'CANT LOG IN',
    //   JSON.stringify(text),
    //   [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')}
    //   ],
    //   { cancelable: false }
    // )
  }

  render () {
    const { qrcode, errors, displayName, dateTime, phone, email, amount } = this.state
    const { navigation, shop } = this.props

    return (
      <KeyboardAvoidingView
        style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
        <ScrollView>
          <Card
            containerStyle={{
              margin: 0,
              width: undefined,
              height: undefined
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#E64B47', marginLeft: 10 }}>
            {shop.shopName}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>
            {shop.address && 
              `${shop.address.fullAddress}, ${isNaN(shop.address.districtName) ? '' : 'Quận '}${shop.address.districtName 
              || ''}, ${shop.address.cityName || ''}`}</Text>  
            <FormLabel>
              Tên người đặt
            </FormLabel>
            <FormInput
              placeholder='Nhập tên'
              value={displayName || ''}
              onChangeText={(text) => this.onChangeText(text, 'displayName')}
              underlineColorAndroid='#CCC'
            />
            {errors.displayName &&
              (<FormValidationMessage>{errors.displayName}</FormValidationMessage>)}

            <FormLabel>
              Thời gian đặt
            </FormLabel>
            <DatePicker
              style={{
                marginHorizontal: 20,
                width: undefined
              }}
              date={dateTime}
              mode='datetime'
              placeholder='Chọn thời gian đặt'
              format='lll'
              minDate={moment(new Date()).add(1,'days')}
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              // onChangeText={(text) => this.onChangeText(text, 'gender')}
              customStyles={{
                dateIcon: {
                  width: 0,
                  height: 0,
                  position: 'absolute'
                },
                dateInput: {
                  borderWidth: 1,
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderColor: '#CCC',
                  width: '100%'
                },
                placeholderText: {
                  textAlign: 'left',
                  width: '100%'
                }
              }}
              onDateChange={(text) => this.onChangeText(text, 'dateTime')}
            />
            {errors.dateTime &&
              (<FormValidationMessage>{errors.dateTime}</FormValidationMessage>)}

            {/* <FormValidationMessage>{'* 30 phút sau giờ đặt, đơn sẽ tự hủy'}</FormValidationMessage> */}

            <FormLabel>
              Số lượng người
            </FormLabel>
            <FormInput
              placeholder='Nhập số lượng'
              value={amount}
              onChangeText={(text) => this.onChangeText(text, 'amount')}
              underlineColorAndroid='#CCC'
              keyboardType={'phone-pad'}
            />
            {errors.amount &&
              (<FormValidationMessage>{errors.amount}</FormValidationMessage>)}

            <FormLabel>
              Email
            </FormLabel>
            <FormInput
              placeholder='Nhập email'
              value={email || ''}
              onChangeText={(text) => this.onChangeText(text, 'email')}
              underlineColorAndroid='#CCC'
            />
            {errors.email &&
              (<FormValidationMessage>{errors.email}</FormValidationMessage>)}

            <FormLabel>
              Số điện thoại
            </FormLabel>
            <FormInput
              placeholder='Nhập SĐT'
              value={phone || ''}
              onChangeText={(text) => this.onChangeText(text, 'phone')}
              underlineColorAndroid='#CCC'
              keyboardType={'phone-pad'}
            />
            {errors.phone &&
              (<FormValidationMessage>{errors.phone}</FormValidationMessage>)}

          </Card>
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
                <Button title='Hủy' onPress={() => navigation.goBack()} />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title='Đặt bàn'
                  onPress={this.submit}
                  backgroundColor='#E44C4C'
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

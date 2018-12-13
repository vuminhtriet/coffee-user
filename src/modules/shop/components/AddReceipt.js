import React, { Component } from 'react'
import {
  View,
  Text,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  // ListView,
  Platform,
  Alert
} from 'react-native'
import ImageResizer from 'react-native-image-resizer'
import { Dropdown } from 'react-native-material-dropdown'
import { TextInputMask } from 'react-native-masked-text'
import { validatePhoneNumber } from '../../../common/utils/validate'
import QRScan from '../../../common/components/pages/QRScan'
import { isEmpty } from 'lodash'
import {
  FormValidationMessage,
  FormInput,
  ListItem,
  Card,
  Icon,
  Badge,
  Button,
  FormLabel
} from 'react-native-elements'
import Permissions from 'react-native-permissions'
const { height } = Dimensions.get('window')

export default class AddReceipt extends Component {
  constructor (props) {
    super(props)
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      code: '',
      memberId: '',
      money: 0,
      point: 0,
      errors: {},
      enableScrollViewScroll: true,
      disabled: false,
      scan: false
    }

    this.submit = this.submit.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onScanCancel = this.onScanCancel.bind(this)
    this.onScanSuccess = this.onScanSuccess.bind(this)
    this.onRequestQrScan = this.onRequestQrScan.bind(this)
  }

  async submit () {
    const {
      // errors,
      code,
      money,
      point,
      memberId,
      enableScrollViewScroll,
      disabled,
      scan
    } = this.state
    const {
      getUserPoints,
      navigation,
      shop,
      token,
      AddReceipt,
      shopDeliveryMethods
    } = this.props

    const errors = {}
    
    if (!code) {
      errors.code = '* Thiếu mã hóa đơn.'
    }
    if (!memberId) {
      errors.memberId = '* Thiếu mã người dùng.'
    }
    if (!money) {
      errors.money = '* Thiếu giá tiền.'
    }else if (!validatePhoneNumber(money)) {
      errors.money = '* Giá tiền không hợp lệ.'
    }

    if (!isEmpty(errors)) {
      return this.setState({ errors })
    }
    this.setState({ disabled: true })
    const result = await AddReceipt(
      token,
      {
        memberId,
        money,
        code,
        point
      },
      shop
    )
    if (result) {
      await getUserPoints(shop)
      this.setState({ disabled: false })
      navigation.goBack()
    }
    this.setState({ disabled: false })
  }

  onRequestQrScan () {
    // this.setState({
    //   scan: true
    // })
    Permissions.check('camera', 'always').then(response => {
      if (response === 'undetermined') {
        Permissions.request('camera', 'always')
          .then(response => {
            if (response === 'authorized') {
              this.setState({
                scan: true
              })
            }
          })
      } else if (response === 'denied') {
        Alert.alert(
          'Yêu cầu truy cập camera',
          'Người dùng nên cho phép camera để quét mã Qr. Mở cài đặt và cho phép.',
          [
            { text: `Không cho`, onPress: () => { }, style: 'cancel' },
            {
              text: `Mở cài đặt`,
              onPress: () => Permissions.canOpenSettings() && Permissions.openSettings()
            }
          ]
        )
      } else if (response === 'authorized') {
        this.setState({
          scan: true
        })
      }
    })
  }

  onScanSuccess (data) {
    const { memberId } = this.state
    this.setState({
      scan: false,
      memberId: data
    })
  }

  onScanCancel () {
    this.setState({
      scan: false
    })
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
    if(field === 'money'){
      this.setState({
        point: text / 10000
      })
    }
  }

  render () {
    const {
      errors,
      code,
      money,
      point,
      memberId,
      enableScrollViewScroll,
      disabled,
      scan
    } = this.state
    // const { countries } = this.props
    return (
      <ScrollView
        scrollEnabled={enableScrollViewScroll}
        style={{
          width: '100%',
          height: undefined
        }}
      >
        <View
          // onStartShouldSetResponderCapture={() => {
          //   this.setState({ enableScrollViewScroll: true })
          // }}
          style={{ flexDirection: 'column', backgroundColor: 'transparent' }}
        >
          
          <View
            style={{
              width: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Icon
              name='qrcode-scan'
              size={40}
              onPress={this.onRequestQrScan}
              type='material-community'
              containerStyle={{
                width: 80,
                height: 80,
                borderRadius: 20,
                position: 'absolute',
                zIndex: 2,
                top: 5,
                right: 5
              }}
              />
          </View>

          <FormValidationMessage containerStyle={{ paddingBottom: 10, backgroundColor: '#FFFFFF' }}>
            * Chọn camera để quét mã QR người dùng
          </FormValidationMessage>

          <Card
            containerStyle={{
              margin: 0,
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: undefined,
              height: undefined
            }}>

            <FormLabel>
                Mã người dùng
              </FormLabel>
              <Text style={{ fontSize: 17, marginTop: 7, marginLeft: 20, color: 'black' }}>
                {memberId || 'none'}</Text>
            {errors.memberId &&
              (<FormValidationMessage>{errors.memberId}</FormValidationMessage>)}

            <FormLabel>
                Mã hóa đơn
              </FormLabel>
            <FormInput
              value={code}
              containerStyle={{ margin: 0, padding: 0 }}
              style={{ marginLeft: 0, padding: 0 }}
              inputStyle={{ marginLeft: 7, padding: 0, textDecorationColor: 'black', color: 'black' }}
              placeholder='Nhập mã hóa đơn'
              onChangeText={(text) => {
                this.onChangeText(text, 'code') }}
            />
            {errors.code &&
              (<FormValidationMessage>{errors.code}</FormValidationMessage>)}

            <FormLabel>
                Số tiền
              </FormLabel>
            <View style={{ width: undefined }}>
              <TextInputMask
                ref={ref => (this.inputRef = ref)}
                type={'money'}
                options={{
                  suffixUnit: '',
                  unit: 'VND ',
                  separator: ' ',
                  precision: 0
                }}
                style={{ 
                   fontSize: 15, marginLeft: 16
                }}
                value={ money}
                onChangeText={(text) => {
                  this.onChangeText(this.inputRef.getRawValue(), 'money') }}
              />
              {errors.money &&
              (<FormValidationMessage>{errors.money}</FormValidationMessage>)}

              <FormLabel>
                Số điểm (10000đ = 1 điểm)
              </FormLabel>
              <Text style={{ fontSize: 17, marginTop: 7, marginLeft: 20, color: 'black' }}>
                {point}</Text>   
              {/* {errors.description &&
              (<FormValidationMessage>{errors.description}</FormValidationMessage>)} */}

            </View>
          </Card>
          
          <Button
            title='Tạo'
            backgroundColor='#E44C4C'
            onPress={this.submit}
            containerViewStyle={{ paddingVertical: 10 }}
            disabled={disabled} />
        </View>

        <Modal
          animationType='slide'
          transparent={false}
          visible={scan}
        >
          <View style={{ width: '100%', height: '100%' }}>
            <QRScan
              cancelButtonTitle={'Cancel'}
              onSucess={this.onScanSuccess}
              onCancel={this.onScanCancel}
              cancelButtonVisible
              enableScanning />
          </View>
        </Modal>
        
      </ScrollView>
    )
  }
}

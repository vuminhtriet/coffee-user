import moment from 'moment'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView
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

const sex = [{value:true,title:'Nam'},{value:false,title:'Nữ'}]

export default class UserInformation extends Component {
  constructor (props) {
    super(props)
    const { user } = props
    const addresses = user.address && user.address
    this.state = {
      displayName: user.displayName || '',
      birthdate: moment(user.birthdate).format('YYYY-MM-DD') || null,
      gender: (user && `${user.isMale}`) || true,
      nationality: (addresses && `${addresses.countryId}`) || '',
      selectedCity: (addresses && `${addresses.cityId}`) || '',
      selectedDistrict: (addresses && `${addresses.districtId}`) || '',
      address: (addresses && `${addresses.fullAddress}`) || '',
      errors: {},
      districts: {},
      qrcode: null
    }
    this.submit = this.submit.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.deleteUserPayment = this.deleteUserPayment.bind(this)
    this.calculateAge = this.calculateAge.bind(this)
  }

  async deleteUserPayment (payment) {
    const {
      token,
      user,
      getUserInformation,
      deleteUserPaymentMethod
    } = this.props
    await deleteUserPaymentMethod(token, user, payment)
    getUserInformation(token, user.id)
  }

  componentDidMount(){
    const { selectedCity } = this.state
    if (selectedCity){
      this.getDistrictInCity(selectedCity)
    }
  }

  calculateAge(birthdate) {
    var birth = new Date(birthdate)
    var ageDifMs = Date.now() - birth.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  submit () {
    const { token, update, user, navigation } = this.props
    const { displayName, birthdate, gender, nationality, addressId, address, selectedCity, selectedDistrict } = this.state
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
    if (!address) {
      errors.address = '* Thiếu địa chỉ'
    }
    if (!selectedCity) {
      errors.selectedCity = '* Thiếu thành phố'
    }
    if (!selectedDistrict) {
      errors.selectedDistrict = '* Thiếu quận'
    }
    if (!isEmpty(errors)) {
      this.setState({ errors })
    } else {
      const age = this.calculateAge(birthdate)
      try {
        const request = update(token,
          {id: user.id,
          displayName,
          birthdate,
          gender,
          age},
          {selectedCity,
          selectedDistrict,
          address}
        )
        if(request){
          return navigation.goBack()
        }
        else{
          return Alert.alert(
            'KHÔNG THỂ CẬP NHẬT',
            'Lỗi từ server',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')}
            ],
            { cancelable: false }
          )
        }
      } catch (error) {
        return Alert.alert(
          'KHÔNG THỂ CẬP NHẬT',
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
      const addresses = nextProp.user.address &&
        nextProp.user.address
      this.setState({
        displayName: nextProp.user.displayName || '',
        birthdate: moment(nextProp.user.birthdate).format('YYYY-MM-DD') || '',
        gender: (nextProp.user && `${nextProp.user.isMale}`) || true,
        nationality: (addresses && `${addresses.countryId}`) || '',
        selectedCity: (addresses && `${addresses.cityId}`) || '',
        selectedDistrict: (addresses && `${addresses.districtId}`) || '',
        address: (addresses && `${addresses.fullAddress}`) || '',
        errors: {}
      })
    }
  }

  getDistrictInCity(id){
    const url = `${TEST_URL}/api/cities/${id}/districts`
    // const url = `${TEST_URL}/api/districts`
    this.setState({ loading: true }, () => {
      axios({
        url,
        timeout: 5000
      })
        .then(response => {
          this.setState({
            districts: response.data,
            loading: false
          })
        })
        .catch(e => {
          this.setState({ districts: {}, loading: false })
        })
    })
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
    if(selectedItem == 'selectedCity'){
      this.getDistrictInCity(value)
      this.setState({['selectedDistrict']: ''})
    }
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

  renderPaymentInfo (payment, paymentType) {
    if (!paymentType || !payment) {
      return null
    }
    switch (paymentType.renderType) {
      case 2:
        return [
          <View
            style={{ flexDirection: 'row', width: '100%' }}
            key='view'
          >
            <FormLabel containerStyle={{ flex: 1 }} key='lable'>
              {payment.paymentAddress}
            </FormLabel>
            <Icon
              name='qrcode-scan'
              size={34}
              type='material-community'
              onPress={() => this.setState({ qrcode: payment.paymentAddress })}
              containerStyle={{ width: 45, marginRight: 15, marginTop: 10 }}
            />
          </View>
        ]
      case 1:
        return [
          <FormLabel key='lable1'>
            Account name: {payment.accountName}
          </FormLabel>,
          <FormLabel key='lable2'>
            Bank name: {payment.bankName}
          </FormLabel>,
          <FormLabel key='lable3'>
            Branch name: {payment.branchName}
          </FormLabel>,
          <FormLabel key='label4'>
            Account number: {payment.accountNumber}
          </FormLabel>
        ]
      default:
        return null
    }
  }

  render () {
    const { qrcode, nationality, errors, displayName, birthdate, 
      gender, address, districts, selectedCity, selectedDistrict } = this.state
    const { navigation, countries, cities } = this.props
    // const country = countries.find(item => `${item.id}` === `${nationality}`)
    const city = cities.find(item => `${item.id}` === `${selectedCity}`)
    const tempGender = sex.find(item => `${item.value}` === `${gender}`)
    
    const district = districts.length > 0  
    ? districts.find(item => `${item.id}` === `${selectedDistrict}`)
    : ''
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
            <FormLabel>
              Tên hiển thị
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
              Ngày sinh
            </FormLabel>
            <DatePicker
              style={{
                marginHorizontal: 20,
                width: undefined
              }}
              date={birthdate}
              mode='date'
              placeholder='Chọn ngày sinh'
              format='YYYY-MM-DD'
              maxDate={moment().format('YYYY-MM-DD')}
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
              onDateChange={(text) => this.onChangeText(text, 'birthdate')}
            />
            <FormLabel>
              Giới tính
            </FormLabel>
            {/* <Dropdown
              value={gender}
              data={[
                { value: true, label: 'Nam' },
                { value: false, label: 'Nữ' }
              ]}
              onChangeText={(text) => this.onChangeText(text, 'gender')}
              containerStyle={{ marginHorizontal: 20 }}
            /> */}
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20
              }}
            >
              <MultiSelect
                hideTags
                single
                items={sex}
                uniqueKey='value'
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={(text) => this.onChangeText(text[0], 'gender')}
                selectedItems={sex}
                selectText={!tempGender ? 'Chọn giới tính' : tempGender.title}
                searchInputPlaceholderText='Tìm kiếm...'
                tagRemoveIconColor='transparent'
                tagBorderColor='#CCC'
                tagTextColor='#CCC'
                selectedItemTextColor='#CCC'
                selectedItemIconColor='#CCC'
                itemTextColor='#000'
                displayKey='title'
                submitButtonColor='#CCC'
                submitButtonText='Submit'
                // fixedHeight
                hideSubmitButton
                searchInputStyle={{
                  color: '#CCC',
                  height: 40
                }}
              />
            </View>
            {/* <FormLabel>
              Nationality
            </FormLabel>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20
              }}
            >
              <MultiSelect
                hideTags
                single
                items={countries}
                uniqueKey='id'
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={(text) => this.onChangeText(text[0], 'nationality')}
                selectedItems={countries}
                selectText={!country ? 'Choose your country' : country.name}
                searchInputPlaceholderText='Search country...'
                tagRemoveIconColor='transparent'
                tagBorderColor='#CCC'
                tagTextColor='#CCC'
                selectedItemTextColor='#CCC'
                selectedItemIconColor='#CCC'
                itemTextColor='#000'
                displayKey='name'
                submitButtonColor='#CCC'
                submitButtonText='Submit'
                fixedHeight
                hideSubmitButton
                searchInputStyle={{
                  color: '#CCC',
                  height: 30
                }}
              />

            </View> */}
            <FormLabel>
              Thành phố
            </FormLabel>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20
              }}
            >
              <MultiSelect
                hideTags
                single
                items={cities}
                uniqueKey='id'
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={(value) => this.onChangeValue('selectedCity', value[0])}
                selectedItems={cities}
                selectText={!city ? 'Chọn thành phố' : city.name}
                searchInputPlaceholderText='Tìm kiếm...'
                tagRemoveIconColor='transparent'
                tagBorderColor='#CCC'
                tagTextColor='#CCC'
                selectedItemTextColor='#CCC'
                selectedItemIconColor='#CCC'
                itemTextColor='#000'
                displayKey='name'
                submitButtonColor='#CCC'
                submitButtonText='Submit'
                fixedHeight
                hideSubmitButton
                searchInputStyle={{
                  color: '#CCC',
                  height: 40
                }}
              />
            </View>
            {errors.selectedCity &&
              (<FormValidationMessage>{errors.selectedCity}</FormValidationMessage>)}
            <FormLabel>
              Quận
            </FormLabel>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20
              }}
            >
              <MultiSelect
                hideTags
                single
                items={districts || []}
                uniqueKey='id'
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={(value) => this.onChangeValue('selectedDistrict', value[0])}
                selectedItems={districts}
                selectText={!district ? 'Chọn quận' : district.name}
                searchInputPlaceholderText='Tìm kiếm...'
                tagRemoveIconColor='transparent'
                tagBorderColor='#CCC'
                tagTextColor='#CCC'
                selectedItemTextColor='#CCC'
                selectedItemIconColor='#CCC'
                itemTextColor='#000'
                displayKey='name'
                submitButtonColor='#CCC'
                submitButtonText='Submit'
                fixedHeight
                hideSubmitButton
                searchInputStyle={{
                  color: '#CCC',
                  height: 40
                }}
              />
            </View>
            {errors.selectedDistrict &&
              (<FormValidationMessage>{errors.selectedDistrict}</FormValidationMessage>)}
            {/* <Dropdown
              value={`${nationality}`}
              data={countries.map(item => {
                return {
                  value: `${item.id}`,
                  label: item.name
                }
              })}
              onChangeText={(text) => this.onChangeText(text, 'nationality')}
              containerStyle={{ marginHorizontal: 20 }}
            /> */}
            <FormLabel>
              Địa chỉ
            </FormLabel>
            <FormInput
              multiline
              placeholder='Nhập địa chỉ đầy đủ'
              value={address || ''}
              onChangeText={(text) => this.onChangeText(text, 'address')}
              underlineColorAndroid='#CCC'
            />
            {errors.address &&
              (<FormValidationMessage>{errors.address}</FormValidationMessage>)}
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
                  title='Cập nhật'
                  onPress={this.submit}
                  backgroundColor='#E44C4C'
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <Modal
          onModalHide={() => this.setState({ qrcode: null })}
          visible={qrcode !== null}
          transparent
          onBackdropPress={() => this.setState({ qrcode: null })}
        >
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.setState({ qrcode: null })}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
                backgroundColor:
                  '#000',
                opacity: 0.2
              }}
            />
            <View
              style={{
                width: 300,
                height: 300,
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF'
              }}>
              <QRCode
                value={qrcode || ''}
                size={250}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    )
  }
}

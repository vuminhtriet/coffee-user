import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import QRCode from 'react-native-qrcode'
import MultiSelect from '../../../libraries/components/MultipleSelect'
// import { Dropdown } from 'react-native-material-dropdown'
import {
  Button,
  Card,
  FormLabel,
  FormInput,
  ListItem,
  FormValidationMessage,
  Icon
} from 'react-native-elements'
import { BASE_URL, ADDRESS_URL, TEST_URL } from '../../../common/models'
import { validatePhoneNumber } from '../../../common/utils/validate'
import axios from 'axios'
import { isEmpty } from 'lodash'

export default class ShopInformation extends Component {
  constructor (props) {
    super(props)
    const { shopAddress, shop } = props
    this.state = {
      errors: {},
      districts: {},
      refreshing: false,
      shopName: shop.shopName || '',
      website: shop.website || '',
      shopPhoneNumber: shop.shopPhoneNumber || '',
      selectedCity: (shop.address && `${shop.address.cityId}`) || '',
      selectedDistrict: (shop.address && `${shop.address.districtId}`) || '',
      fullAddress: (shop.address && `${shop.address.fullAddress}`) || ''
    }
    // this.getCities = this.getCities.bind(this)
    this.updateInformation = this.updateInformation.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  async updateInformation () {
    const {
      token,
      navigation,
      updateShop, shop } = this.props
    const { selectedCity, selectedDistrict, shopName, shopPhoneNumber,
        website, fullAddress } = this.state
    // return Alert.alert(
    //   'KHÔNG THỂ CẬP NHẬT',
    //   JSON.stringify({ selectedCity, selectedDistrict, shopName, shopPhoneNumber,
    //     website, fullAddress }),
    //   [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')}
    //   ],
    //   { cancelable: false }
    // )
    const errors = {}
    if (!shopName) {
      errors.shopName = '* Thiếu tên quán'
    }
    if (!selectedCity) {
      errors.selectedCity = '* Thiếu thành phố'
    }
    if (!selectedDistrict) {
      errors.selectedDistrict = '* Thiếu quận'
    }
    if (!fullAddress) {
      errors.fullAddress = '* Thiếu địa chỉ'
    }
    if (!shopPhoneNumber) {
      errors.shopPhoneNumber = '* Thiếu số điện thoại'
    }else if (!validatePhoneNumber(shopPhoneNumber)) {
      errors.shopPhoneNumber = '* Số điện thoại không hợp lệ.'
    }
    if (!isEmpty(errors)) {
      return this.setState({ errors })
    } 
    const result = await updateShop(token, shop, shopName, shopPhoneNumber, website, 
      selectedCity, selectedDistrict, fullAddress)
    if (result) {
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
    if(field == 'selectedCity'){
      this.getDistrictInCity(text)
    }
  }

  componentDidMount () {
    const { selectedCity } = this.state
    if (selectedCity){
      this.getDistrictInCity(selectedCity)
    }
  }

  componentWillReceiveProps (nextProp) {
    const { shop, shopAddress } = this.props
    if (nextProp.shop && JSON.stringify(shop) !== JSON.stringify(nextProp.shop)) {
      const addresses = nextProp.shop.address &&
        nextProp.shop.address
      this.setState({
        shopName: nextProp.shop.shopName || '',
        shopPhoneNumber: nextProp.shop.shopPhoneNumber || '',
        website: nextProp.shop.website || '',
        nationality: (addresses && `${addresses.countryId}`) || '',
        selectedCity: (addresses && `${addresses.cityId}`) || '',
        selectedDistrict: (addresses && `${addresses.districtId}`) || '',
        address: (addresses && `${addresses.fullAddress}`) || '',
        errors: {}
      })
    }
  }

  getDistrictInCity(id){
    // const url = `${TEST_URL}/api/cities/${id}/districts`
    const url = `${TEST_URL}/api/districts`
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

  // async getCities (countryId) {
  //   const { countries } = this.props
  //   let data = []
  //   const country = countries.find(item => item.id === parseInt(countryId))
  //   const filter = {
  //     where: {
  //       country: country.code
  //     }
  //   }
  //   const url = `${BASE_URL}/api/cities?filter=${JSON.stringify(filter)}`
  //   const response = await axios({ url })
  //   if (response && response.data) {
  //     data = response.data.map(item => {
  //       return {
  //         value: `${item.id}`,
  //         label: item.name
  //       }
  //     })
  //   }
  //   this.setState({ cities: data })
  // }

  render () {
    const {
      navigation,
      countries,
      changeText,
      cities
    } = this.props
    const { districts, errors, selectedCity, selectedDistrict, shopName, shopPhoneNumber,
    website, fullAddress } = this.state
    // const country = countries.find(item => `${item.id}` === `${currentAddress.countryId}`)
    const city = cities && cities.find(item => `${item.id}` === `${selectedCity}`)
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
              Tên quán
            </FormLabel>
            <FormInput
              value={shopName}
              placeholder='Nhập tên quán'
              onChangeText={(text) => this.onChangeText(text, 'shopName')}
              underlineColorAndroid='#CCC'
            />
            {errors.shopName &&
              (<FormValidationMessage>{errors.shopName}</FormValidationMessage>)}
            {/* <FormLabel>
              Country
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
                onSelectedItemsChange={(text) => {
                  changeText(text[0], 'address', 'countryId')
                }}
                selectedItems={[`${country ? country.id : undefined}`]}
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
            {/* <Dropdown
              value={currentAddress.countryId
                ? `${currentAddress.countryId}` : ''}
              label='Country'
              data={countries.map(item => {
                return {
                  value: `${item.id}`,
                  label: item.name
                }
              })}
              onChangeText={(text) => {
                changeText(text, 'address', 'countryId')
                this.getCities(text)
              }}
              containerStyle={{ marginHorizontal: 20 }}
            /> */}

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
                items={cities || []}
                uniqueKey='id'
                ref={(component) => { this.multiSelectCity = component }}
                onSelectedItemsChange={(value) => this.onChangeText(value[0], 'selectedCity')}
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
            {/* <Dropdown
              value={currentAddress.cityId
                ? `${currentAddress.cityId}` : ''}
              label='City'
              data={cities}
              onChangeText={(text) => changeText(text, 'address', 'cityId')}
              containerStyle={{ marginHorizontal: 20 }}
            /> */}

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
                ref={(component) => { this.multiSelectDistrict = component }}
                onSelectedItemsChange={(value) => this.onChangeText(value[0], 'selectedDistrict')}
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
            <FormLabel>
              Địa chỉ
            </FormLabel>
            <FormInput
              multiline
              placeholder='Nhập địa chỉ đầy đủ'
              value={fullAddress}
              onChangeText={(text) => this.onChangeText(text, 'fullAddress')}
              underlineColorAndroid='#CCC'
            />
            {errors.fullAddress &&
              (<FormValidationMessage>{errors.fullAddress}</FormValidationMessage>)}
            <FormLabel>
              Số điện thoại
            </FormLabel>
            <FormInput
              placeholder='Nhập số điện thoại'
              value={shopPhoneNumber}
              onChangeText={(text) => this.onChangeText(text, 'shopPhoneNumber')}
              underlineColorAndroid='#CCC'
              keyboardType={'phone-pad'}
            />
            {errors.shopPhoneNumber &&
              (<FormValidationMessage>{errors.shopPhoneNumber}</FormValidationMessage>)}
            <FormLabel>
              Website
            </FormLabel>
            <FormInput
              placeholder='Nhập địa chỉ website'
              value={website}
              onChangeText={(text) => this.onChangeText(text, 'website')}
              underlineColorAndroid='#CCC'
            />
          </Card>
        </ScrollView>
        <View
          style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ flex: 1 }}>
            <Button title='Hủy' onPress={() => navigation.goBack()} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title='Cập nhật'
              backgroundColor='#E44C4C'
              onPress={this.updateInformation}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

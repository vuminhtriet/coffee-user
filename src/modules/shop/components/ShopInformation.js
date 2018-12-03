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
import { BASE_URL, TEST_URL } from '../../../common/models'
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
      disabled: false,
      shopName: shop.shopName || '',
      website: shop.website || '',
      shopPhoneNumber: shop.shopPhoneNumber || '',
      selectedCity: (shop.address && `${shop.address.cityId}`) || '',
      selectedDistrict: (shop.address && `${shop.address.districtId}`) || '',
      fullAddress: (shop.address && `${shop.address.fullAddress}`) || '',
      selectedStyle: (shop.style && `${shop.style.styId}`) || ''
    }
    // this.getCities = this.getCities.bind(this)
    this.updateInformation = this.updateInformation.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  async updateInformation () {
    const {
      token,
      navigation,
      updateShop, 
      shop,
      getShopLatLong,
      cities,
      styles } = this.props
    const { selectedCity, selectedDistrict, shopName, shopPhoneNumber,
        website, fullAddress, districts, selectedStyle } = this.state
    this.setState({ disabled: true })
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
    if (!selectedStyle) {
      errors.selectedStyle = '* Thiếu phong cách quán'
    }
    if (!shopPhoneNumber) {
      errors.shopPhoneNumber = '* Thiếu số điện thoại'
    }else if (!validatePhoneNumber(shopPhoneNumber)) {
      errors.shopPhoneNumber = '* Số điện thoại không hợp lệ.'
    }
    if (!isEmpty(errors)) {
      return this.setState({ errors, disabled: false })
    }
    const city = cities && cities.find(item => `${item.id}` === `${selectedCity}`)
    const district = districts && districts.find(item => `${item.id}` === `${selectedDistrict}`)
    const style = styles && styles.find(item => `${item.styId}` === `${selectedStyle}`)
    const latlng = await getShopLatLong(fullAddress.split(' ').join('+'), 
    city.name.split(' ').join('+'), district.name.split(' ').join('+'))
    if (latlng && latlng.lat && latlng.lng){
      const result = await updateShop(token, shop, shopName, shopPhoneNumber, website, 
      selectedCity, selectedDistrict, selectedStyle, style.name, fullAddress, latlng.lat, latlng.lng)
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
    this.setState({ disabled: false })
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
      this.setState({['selectedDistrict']: ''})
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
        selectedStyle: (shop.style && `${shop.style.styId}`) || '',
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

  render () {
    const {
      navigation,
      changeText,
      cities,
      styles
    } = this.props
    const { districts, errors, selectedCity, selectedDistrict, shopName, shopPhoneNumber,
    website, fullAddress, disabled, selectedStyle } = this.state
    const city = cities && cities.find(item => `${item.id}` === `${selectedCity}`)
    const style = styles && styles.find(item => `${item.styId}` === `${selectedStyle}`)
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

            <FormLabel>
              Phong cách quán
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
                items={styles || []}
                uniqueKey='styId'
                ref={(component) => { this.multiSelectDistrict = component }}
                onSelectedItemsChange={(value) => this.onChangeText(value[0], 'selectedStyle')}
                selectedItems={styles}
                selectText={!style ? 'Chọn phong cách quán' : style.name}
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
                // fixedHeight
                hideSubmitButton
                searchInputStyle={{
                  color: '#CCC',
                  height: 40
                }}
              />
            </View>
            {errors.selectedStyle &&
              (<FormValidationMessage>{errors.selectedStyle}</FormValidationMessage>)}

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
            <Button title='Hủy' 
            disabled={disabled} 
            onPress={() => navigation.goBack()} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title='Cập nhật'
              disabled={disabled}
              backgroundColor='#E44C4C'
              onPress={this.updateInformation}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

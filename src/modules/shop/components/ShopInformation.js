import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Text
} from 'react-native'
import QRCode from 'react-native-qrcode'
import MultiSelect from '../../../libraries/components/MultipleSelect'
import BrandListModal from '../../shop/components/BrandListModal'
import ShopLocationMap from '../../shop/containers/ShopLocationMap'
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
      mapOn: false,
      refreshing: false,
      disabled: false,
      showOption: false,
      shopName: shop.shopName || '',
      website: shop.website || '',
      shopPhoneNumber: shop.shopPhoneNumber || '',
      selectedCity: (shop.address && `${shop.address.cityId}`) || '',
      selectedDistrict: (shop.address && `${shop.address.districtId}`) || '',
      fullAddress: (shop.address && `${shop.address.fullAddress}`) || '',
      selectedStyle: (shop.styleId && `${shop.styleId}`) || '',
      selectedBrand: (shop.brandId && `${shop.brandId}`) || '',
      tempLat: (shop.shopLocation && `${shop.shopLocation.lat}`) || null,
      tempLng: (shop.shopLocation && `${shop.shopLocation.lng}`) || null
    }
    // this.getCities = this.getCities.bind(this)
    this.updateInformation = this.updateInformation.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.toggleOption = this.toggleOption.bind(this)
  }

  toggleOption = () => {
    const { showOption } = this.state
    this.setState({
      showOption: !showOption
    })
  }

  closeFilter = () => {
    this.setState({ showOption: false })
  }

  onSelect = (item) => {
    const { selectedBrand, showOption } = this.state
    this.setState({ selectedBrand: item, showOption: false })
  }

  openMap = () => {
    const {
      token,
      navigation,
      updateShop, 
      shop,
      getShopLatLong,
      cities,
      styles,
      brands } = this.props
    const { selectedCity, selectedDistrict, shopName, shopPhoneNumber,
        website, fullAddress, districts, selectedStyle, selectedBrand
      ,tempLat, tempLng, mapOn } = this.state

    if(selectedCity && selectedDistrict && !tempLat && !tempLng){
      const city = cities && cities.find(item => `${item.id}` === `${selectedCity}`)
      const district = districts && districts.find(item => `${item.id}` === `${selectedDistrict}`)
      const latlng = getShopLatLong(fullAddress.split(' ').join('+'), 
        city.name.split(' ').join('+'), district.name.split(' ').join('+'))
      this.setState({
        tempLat: latlng && latlng.lat || null,
        tempLng: latlng && latlng.lng || null
      })
    }
    this.setState({ mapOn: !mapOn })
  }

  exitMap = () => {
    const { mapOn } = this.state
    this.setState({ mapOn: !mapOn })
  }

  setFullAddress = (data) => {
    var address = data.formatted_address.replace(/\,/g,'')
    data.address_components.map(component => {
      if(component.types[0] === "administrative_area_level_1" || 
      component.types[0] === "administrative_area_level_2" ||
      component.types[0] === "country"){
        address = address.replace(` ${component.long_name}`,'')
      }
    })
    this.setState({ fullAddress: address })
  }

  setDistrictCity = (data) => {
    const {
      token,
      navigation,
      updateShop, 
      shop,
      getShopLatLong,
      cities,
      styles,
      brands } = this.props
    const { selectedCity, selectedDistrict, shopName, shopPhoneNumber,
        website, fullAddress, districts, selectedStyle, selectedBrand
      ,tempLat, tempLng } = this.state
    data.address_components.map(component => {
      console.log("đệ quy", component)
      if(component.types[0] === "administrative_area_level_1"){
        const city = cities && cities.find(item => `${item.name}` === `${component.long_name}`)
        this.getDistrictInCity(city.id)
        this.setState({ selectedCity: city.id })
        console.log("TP", component.long_name)
        console.log("city", city)
      }
      if(component.types[0] === "administrative_area_level_2"){
        const district = districts && districts.find(
          item => `${item.name}` === `${component.long_name.replace('Quận ','')}`)
        this.setState({ selectedDistrict: district.id })
        console.log("quận", component.long_name)
        console.log("district", district)
      }
    })
  }

  setLatLng = (lat, lng) => {
    this.setState({ tempLat: lat, tempLng: lng })
  }

  async updateInformation () {
    const {
      token,
      navigation,
      updateShop, 
      shop,
      getShopLatLong,
      cities,
      styles,
      brands } = this.props
    const { selectedCity, selectedDistrict, shopName, shopPhoneNumber,
        website, fullAddress, districts, selectedStyle, selectedBrand
      ,tempLat, tempLng } = this.state
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
    if (!selectedBrand) {
      errors.selectedBrand = '* Thiếu thương hiệu'
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
    const style = styles && styles.find(item => `${item.id}` === `${selectedStyle}`)
    const brand = brands && brands.find(item => `${item.id}` === `${selectedBrand}`)
    // if(!tempLat || !tempLng || tempLat === '' || tempLng === '') {
      const latlng = await getShopLatLong(fullAddress.split(' ').join('+'), 
    city.name.split(' ').join('+'), district.name.split(' ').join('+'))
    //   this.setState({
    //     tempLat: latlng && latlng.lat || null,
    //     tempLng: latlng && latlng.lng || null
    //   })
    // }

    if (latlng.lat && latlng.lng){
      const result = await updateShop(token, shop, shopName, shopPhoneNumber, website, 
      selectedCity, city.name, selectedDistrict, district.name, selectedStyle, style.name, 
      selectedBrand, brand.name, fullAddress, latlng.lat, latlng.lng)
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
    const {
      token,
      navigation,
      updateShop, 
      shop,
      getShopLatLong,
      cities,
      styles,
      brands } = this.props
    const { selectedCity, selectedDistrict, shopName, shopPhoneNumber,
        website, fullAddress, districts, selectedStyle, selectedBrand
      ,tempLat, tempLng, errors } = this.state

    this.setState({
      [field]: text,
      errors: {
        ...errors,
        [field]: undefined
      }
    })
    if(field == 'selectedCity'){
      this.getDistrictInCity(text)
      this.setState({['selectedDistrict']: ''
      // , tempLat: null, tempLng: null
    })
    }
    // if(field == 'fullAddress'){
    //   this.setState({ tempLat: null, tempLng: null })
    // }
    // if(field == 'selectedDistrict'){
    //   this.setState({ tempLat: null, tempLng: null })
    // }
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
        selectedStyle: (shop.styleId && `${shop.styleId}`) || '',
        selectedBrand: (shop.brandId && `${shop.brandId}`) || '',
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
      styles,
      brands,
      shop
    } = this.props
    const { districts, errors, selectedCity, selectedDistrict, shopName, shopPhoneNumber,
    website, fullAddress, disabled, selectedStyle, selectedBrand, showOption, mapOn,
    tempLat, tempLng } = this.state
    const city = cities && cities.find(item => `${item.id}` === `${selectedCity}`)
    const style = styles && styles.find(item => `${item.id}` === `${selectedStyle}`)
    const brand = brands && brands.find(item => `${item.id}` === `${selectedBrand}`)
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
                uniqueKey='id'
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
              Thương hiệu
            </FormLabel>
            <TouchableOpacity
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                flexDirection: 'column',
                height: 55
              }}
              onPress={this.toggleOption}
              // {<Text style={{ marginTop: 7 }}>
              //   {!brand ? 'Chọn thương hiệu' : brand.name}</Text>}
            >
              <View
                style= {{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginTop: 7
                }}
              >
                <Text style={{color: 'black'}}>
                  {!brand ? 'Chọn thương hiệu' : brand.name}
                </Text>
                <Icon
                  key='icon'
                  name='caret-right'
                  type='font-awesome'
                  size={20}
                  color='#A9A9A9'
                />
              </View>
              <View style={{marginTop: 10, width: '100%', height: 1, backgroundColor: '#DCDCDC'}}/>
            </TouchableOpacity>
            {errors.selectedBrand &&
              (<FormValidationMessage>{errors.selectedBrand}</FormValidationMessage>)}

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
            {/* <View style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              alignContent: 'center'              
            }}> */}
              <FormInput
                multiline
                placeholder='Nhập địa chỉ đầy đủ'
                // containerStyle={{ width: '91%' }}
                // style={{ width: '91%' }}
                // inputStyle={{ width: '91%' }}
                value={fullAddress}
                onChangeText={(text) => this.onChangeText(text, 'fullAddress')}
                underlineColorAndroid='#CCC'
              />
              {/* <Icon
                name='map-pin'
                size={25}
                onPress={this.openMap}
                type='feather'
                containerStyle={{
                  width: 25,
                  height: 25,
                  borderRadius: 0,
                  position: 'absolute',
                  zIndex: 2,
                  top: 15,
                  right: 13,
                  paddingBottom: 0
                }}
              />
            </View> */}
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
              autoCapitalize='none'
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
        <Modal
          animationType='none'
          transparent
          visible={showOption}
        >
          <BrandListModal
            selectedBrand={selectedBrand}
            onSelect={this.onSelect}
            closeModal={this.closeFilter}
            brands={brands}
          />
        </Modal>
        {/* <Modal
          animationType='slide'
          transparent={false}
          visible={mapOn}
        >
          <ShopLocationMap
            onBack={this.exitMap}
            setAddress={this.setFullAddress}
            setLatlng={this.setLatLng}
            setDistrictCity={this.setDistrictCity}
            lat={tempLat}
            lng={tempLng}
            address={`${fullAddress}, ${district.name || ''}, ${city.name || ''}`}
            shop={shop}
          />
        </Modal> */}
      </KeyboardAvoidingView>
    )
  }
}

import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView
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
  Icon
} from 'react-native-elements'
import { BASE_URL } from '../../../common/models'
import axios from 'axios'

export default class ShopInformation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
    this.getCities = this.getCities.bind(this)
    this.updateInformation = this.updateInformation.bind(this)
  }

  async updateInformation () {
    const {
      token,
      navigation,
      currentShop,
      currentAddress,
      updateShop } = this.props
    const result = await updateShop(token, {
      shop: currentShop,
      address: currentAddress
    })
    if (result) {
      return navigation.goBack()
    }
  }

  componentDidMount () {
    const { shop, shopAddress, ready } = this.props
    shop && shopAddress && ready(shop, shopAddress)
  }

  componentWillReceiveProps (nextProps) {
    const { currentAddress } = nextProps
    if (currentAddress &&
      currentAddress.countryId &&
      (!this.props.currentAddress ||
        currentAddress.countryId !== this.props.currentAddress.countryId)) {
      this.getCities(currentAddress.countryId)
    }
  }

  async getCities (countryId) {
    const { countries } = this.props
    let data = []
    const country = countries.find(item => item.id === parseInt(countryId))
    const filter = {
      where: {
        country: country.code
      }
    }
    const url = `${BASE_URL}/api/cities?filter=${JSON.stringify(filter)}`
    const response = await axios({ url })
    if (response && response.data) {
      data = response.data.map(item => {
        return {
          value: `${item.id}`,
          label: item.name
        }
      })
    }
    this.setState({ cities: data })
  }

  render () {
    const {
      navigation,
      countries,
      changeText,
      currentShop,
      currentAddress
    } = this.props
    const { cities } = this.state
    const country = countries.find(item => `${item.id}` === `${currentAddress.countryId}`)
    const city = cities && cities.find(item => `${item.value}` === `${currentAddress.cityId}`)
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
              Shop name
            </FormLabel>
            <FormInput
              value={currentShop.name}
              onChangeText={(text) => changeText(text, 'shop', 'name')}
            />

            <FormLabel>
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
                  this.getCities(text[0])
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
            </View>
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
              City
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
                uniqueKey='value'
                ref={(component) => { this.multiSelectCity = component }}
                onSelectedItemsChange={(text) => {
                  changeText(text[0], 'address', 'cityId')
                }}
                selectedItems={[`${city ? city.value : undefined}`]}
                selectText={!city ? 'Choose your city' : city.label}
                searchInputPlaceholderText='Search city...'
                tagRemoveIconColor='transparent'
                tagBorderColor='#CCC'
                tagTextColor='#CCC'
                selectedItemTextColor='#CCC'
                selectedItemIconColor='#CCC'
                itemTextColor='#000'
                displayKey='label'
                submitButtonColor='#CCC'
                submitButtonText='Submit'
                fixedHeight
                hideSubmitButton
                searchInputStyle={{
                  color: '#CCC',
                  height: 30
                }}
              />
            </View>
            {/* <Dropdown
              value={currentAddress.cityId
                ? `${currentAddress.cityId}` : ''}
              label='City'
              data={cities}
              onChangeText={(text) => changeText(text, 'address', 'cityId')}
              containerStyle={{ marginHorizontal: 20 }}
            /> */}

            <FormLabel>
              Address
            </FormLabel>
            <FormInput
              multiline
              placeholder='Enter your address'
              value={currentAddress.fullAddress}
              onChangeText={(text) => changeText(text, 'address', 'fullAddress')}
            />

            <FormLabel>
              Phone number
            </FormLabel>
            <FormInput
              placeholder='Enter your phone number'
              value={currentAddress.phoneNumber}
              onChangeText={(text) => changeText(text, 'address', 'phoneNumber')}
            />

            <FormLabel>
              Website
            </FormLabel>
            <FormInput
              placeholder='Enter your website'
              value={currentShop.website}
              onChangeText={(text) => changeText(text, 'shop', 'website')}
            />
          </Card>
        </ScrollView>
        <View
          style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ flex: 1 }}>
            <Button title='Cancel' onPress={() => navigation.goBack()} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title='Update'
              backgroundColor='#E44C4C'
              onPress={this.updateInformation}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  CheckBox,
  FormLabel,
  FormValidationMessage
} from 'react-native-elements'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubHeader from '../../../common/components/elements/SubHeader'
import { isEmpty } from 'lodash'
import { Dropdown } from 'react-native-material-dropdown'
import MultiSelect from 'react-native-multiple-select'
import { TEST_URL } from '../../../common/models'
import axios from 'axios'

export default class PriceFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
      districts: [],
      change: false,
      errors: {}
    }
  }

  componentDidMount() {
    const { chosenLocation } = this.props
    if (chosenLocation && chosenLocation.cityId){
      this.getDistrictInCity(chosenLocation.cityId)
    }
  }

  _chooseLocation = (text, key) => {
    const { chooseLocation, chosenLocation } = this.props
    const { errors } = this.state
    chooseLocation({ [key]: text })
    this.setState({ 
      errors: {
        ...errors,
        [key]: undefined
      }
    })
    if(key == 'cityId'){
      this.getDistrictInCity(text)
      this.setState({change: true})
    }
    if(key == 'districtId'){
      this.setState({change: false})
    }
  }

  _closeModal = () => {
    const { closeModal, chosenLocation } = this.props
    const { errors, change } = this.state
    const newErrors = {}
    if (!chosenLocation.cityId) {
      newErrors.cityId = '* Thiếu thành phố'
    }
    if (!chosenLocation.districtId) {
      newErrors.districtId = '* Thiếu quận'
    }
    if (change) {
      newErrors.districtId = '* Thiếu quận'
    }
    if (!isEmpty(newErrors)) {
      return this.setState({
        errors: {
          ...errors,
          ...newErrors
        }
      })
    }
    this.setState({
      errors: {
        ...errors,
        cityId: undefined,
        districtId: undefined
      }
    })
    closeModal()
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
          this.setState({ districts: [], loading: false })
        })
    })
  }

  render() {
    const { cities, closeModal, chosenLocation } = this.props
    const { selectedItems, districts, errors } = this.state
    const city = cities.find(item => `${item.id}` === `${chosenLocation.cityId}`)
    const district = districts.length > 0  
    ? districts.find(item => `${item.id}` === `${chosenLocation.districtId}`) : ''
    
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle title='Vị trí' />
        </View>
        <SubHeader
          onLeftComponent={
            <View>
              <CheckBox
                title='Tất cả'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={true}
                containerStyle={{ backgroundColor: '#fff', borderBottomColor: '#000' }}
              />
            </View>
          }
          onRightComponent={
            <TouchableOpacity
              style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              onPress={this._closeModal}
            >
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Xong</Text>
            </TouchableOpacity>
          }
        />

        <View>
          <FormLabel>
            Chọn thành phố
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
              uniqueKey="id"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={(text) => this._chooseLocation(text[0], 'cityId')}
              selectedItems={cities}
              selectText={!city ? 'Chọn thành phố' : city.name}
              searchInputPlaceholderText="Tìm thành phố..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              hideSubmitButton
              searchInputStyle={{ color: '#CCC', height: 40 }}
            />
          </View>
          {errors.cityId &&
            (<FormValidationMessage>{errors.cityId}</FormValidationMessage>)}

          <FormLabel>
            Chọn quận
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
              uniqueKey="id"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={(text) => this._chooseLocation(text[0], 'districtId')}
              selectedItems={districts}
              selectText={!district ? 'Chọn quận' : district.name}
              searchInputPlaceholderText="Tìm quận..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              hideSubmitButton
              searchInputStyle={{ color: '#CCC', height: 40 }}
            />
          </View>
          {errors.districtId &&
            (<FormValidationMessage>{errors.districtId}</FormValidationMessage>)}

        </View>
      </View>
    )
  }
}

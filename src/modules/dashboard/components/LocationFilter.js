import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  CheckBox,
  FormLabel
} from 'react-native-elements'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubHeader from '../../../common/components/elements/SubHeader'
import { Dropdown } from 'react-native-material-dropdown'
import MultiSelect from 'react-native-multiple-select'

export default class PriceFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: []
    }
  }

  _chooseLocation = (text, key) => {
    const { chooseLocation } = this.props
    chooseLocation({ [key]: text })
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const { countries, closeModal, chosenLocation } = this.props
    const { selectedItems } = this.state
    const country = countries.find(item => `${item.id}` === `${chosenLocation.countryId}`)
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
          <HeaderTitle title='Location' />
        </View>
        <SubHeader
          onLeftComponent={
            <View>
              <CheckBox
                title='All'
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
              onPress={closeModal}
            >
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Done</Text>
            </TouchableOpacity>
          }
        />

        <View>
          <FormLabel>
            Choose country
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
              uniqueKey="id"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={(text) => this._chooseLocation(text[0], 'countryId')}
              selectedItems={countries}
              selectText={!country ? 'Choose country' : country.name}
              searchInputPlaceholderText="Search countries..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              hideSubmitButton
              searchInputStyle={{ color: '#CCC' }}
            />
          </View>
        </View>
      </View>
    )
  }
}

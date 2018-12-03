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

export default class StyleFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
      errors: {}
    }
  }

  componentDidMount() {
  }

  _chooseStyle = (text, key) => {
    const { chooseStyle, chosenStyle } = this.props
    const { errors } = this.state
    chooseStyle({ [key]: text })
    this.setState({ 
      errors: {
        ...errors,
        [key]: undefined
      }
    })
  }

  _closeModal = () => {
    const { closeModal, chosenStyle } = this.props
    const { errors } = this.state
    const newErrors = {}
    if (!chosenStyle.styleId) {
      newErrors.styleId = '* Thiếu phong cách quán'
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
        styleId: undefined
      }
    })
    closeModal()
  }

  render() {
    const { styles, closeModal, chosenStyle } = this.props
    const { errors } = this.state
    const style = styles.find(item => `${item.styId}` === `${chosenStyle.styleId}`)
    if (styles.length === 13) {
      styles.push({"styId": 14,"name":"Tất cả"})
    }
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
          <HeaderTitle title='Phong cách quán' />
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
            Chọn phong cách quán
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
              items={styles}
              uniqueKey="styId"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={(text) => this._chooseStyle(text[0], 'styleId')}
              selectedItems={styles}
              selectText={!style ? 'Chọn phong cách' : style.name}
              searchInputPlaceholderText="Tìm phong cách..."
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
          {errors.styleId &&
            (<FormValidationMessage>{errors.styleId}</FormValidationMessage>)}

        </View>
      </View>
    )
  }
}

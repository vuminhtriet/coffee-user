import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native'
import {
  CheckBox,
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubHeader from '../../../common/components/elements/SubHeader'
import { Dropdown } from 'react-native-material-dropdown'
import { isEmpty } from 'lodash'
import { TextInputMask } from 'react-native-masked-text'
import { validatePhoneNumber } from '../../../common/utils/validate'

export default class PriceFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  _choosePrice = (text, key) => {
    const { choosePrice } = this.props
    const { errors } = this.state
    this.setState({
      errors: {
        ...errors,
        [key]: undefined
      }
    })
    choosePrice({ [key]: text })
  }

  _closeModal = () => {
    const { closeModal, chosenPrice } = this.props
    const { errors } = this.state
    const newErrors = {}
    if (parseFloat(chosenPrice.min) > parseFloat(chosenPrice.max)) {
      newErrors.max = '* Giá tiền max phải lớn hơn hoặc bằng giá tiền min'
      newErrors.min = '* Giá tiền min phải nhỏ hơn hoặc bằng giá tiền max'
    }
    // if (parseFloat(chosenPrice.max) == 0) {
    //   newErrors.max = '* Giá tiền max không được bằng 0'
    // }
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
        min: undefined,
        max: undefined
      }
    })
    closeModal()
  }

  render() {
    const { closeModal, chosenPrice } = this.props
    const { errors } = this.state
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
          <HeaderTitle title='Giá' />
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

          {/* <FormInput
            placeholder='Min value'
            value={chosenPrice.min || ''}
            onChangeText={(text) => this._choosePrice(text, 'min')}
          /> */}
          <TextInputMask
            ref={ref => (this.minRef = ref)}
            type={'money'}
            options={{
              suffixUnit: '',
              unit: 'Nhập giá min VND ',
              separator: ' ',
              precision: 0
            }}
            style={{ 
              width: '100%', fontSize: 15, marginLeft: 15
            }}
            value={chosenPrice.min}
            onChangeText={(text) => {
              this._choosePrice(this.minRef.getRawValue(), 'min') }}
          />
          {errors.min &&
            (<FormValidationMessage>{errors.min}</FormValidationMessage>)}

          {/* <FormInput
            placeholder='Max value'
            value={chosenPrice.max || ''}
            onChangeText={(text) => this._choosePrice(text, 'max')}
          /> */}
          <TextInputMask
            ref={ref => (this.maxRef = ref)}
            type={'money'}
            options={{
              suffixUnit: '',
              unit: 'Nhập giá max VND ',
              separator: ' ',
              precision: 0
            }}
            style={{ 
              width: '80%', fontSize: 15, marginLeft: 15, marginTop: 20
            }}
            value={chosenPrice.max}
            onChangeText={(text) => {
              this._choosePrice(this.maxRef.getRawValue(), 'max') }}
          />
          {errors.max &&
            (<FormValidationMessage>{errors.max}</FormValidationMessage>)}
        </View>
      </View>
    )
  }
}

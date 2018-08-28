import React, { Component, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
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
import { isEmpty } from 'lodash';

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
    if (!chosenPrice.unitId && (chosenPrice.min || chosenPrice.max)) {
      newErrors.unitId = '* Currency unit required'
    }
    if (chosenPrice.min && chosenPrice.max && parseFloat(chosenPrice.min) > parseFloat(chosenPrice.max)) {
      newErrors.max = '* Max value must larger or equal than min value';
      newErrors.min = '* Min value must smaller or equal than max value'
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
        unitId: undefined,
        min: undefined,
        max: undefined
      }
    })
    closeModal()
  }

  render() {
    const { units, closeModal, chosenPrice } = this.props
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
          <HeaderTitle title='Price' />
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
              onPress={this._closeModal}
            >
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Done</Text>
            </TouchableOpacity>
          }
        />

        <View>
          <FormLabel>
            Choose currency unit
          </FormLabel>
          <Dropdown
            label='Currency unit'
            data={units}
            value={chosenPrice.unitId || ''}
            containerStyle={{ marginHorizontal: 16 }}
            onChangeText={(text) => this._choosePrice(text, 'unitId')}
          />
          {errors.unitId &&
            (<FormValidationMessage>{errors.unitId}</FormValidationMessage>)}

          <FormInput
            placeholder='Min value'
            value={chosenPrice.min || ''}
            onChangeText={(text) => this._choosePrice(text, 'min')}
          />
          {errors.min &&
            (<FormValidationMessage>{errors.min}</FormValidationMessage>)}

          <FormInput
            placeholder='Max value'
            value={chosenPrice.max || ''}
            onChangeText={(text) => this._choosePrice(text, 'max')}
          />
          {errors.max &&
            (<FormValidationMessage>{errors.max}</FormValidationMessage>)}
        </View>
      </View>
    )
  }
}

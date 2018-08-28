import React, { Component } from 'react'
import {
  Text,
  Modal,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import {
  Icon,
  Card,
  ListItem,
  FormInput,
  Button,
  FormLabel
} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'

export default class AdditionalFees extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      feeTitle: '',
      feeValue: '',
      feeUnit: '',
      feeDescription: '',
    }
  }

  requestAddFee = () => {
    const { modal } = this.state
    this.setState({
      modal: !modal
    })
  }

  addFee = () => {
    const { units, addFee } = this.props
    const { feeTitle, feeValue, feeUnit, feeDescription } = this.state
    const unit = units.find(item => item.id === feeUnit)
    addFee && addFee({
      feeTitle,
      feeValue,
      feeUnit: unit.id,
      feeDescription
    })
    this.setState({
      modal: false
    })
  }

  removeFee = (index) => {
    const { removeFee } = this.props
    removeFee && removeFee(index)
  }

  onTextChange = (text, type) => {
    this.setState({
      [type]: text
    })
  }

  render() {
    const { fees, editable, units } = this.props
    const { modal } = this.state
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        paddingBottom: 10,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Additional fees
        </FormLabel>
        {editable && <Icon
          name='add'
          onPress={this.requestAddFee}
          color='#E44C4C'
          containerStyle={{ position: 'absolute', right: 15, top: 15 }} />}
        {fees && fees.map((item, index) => {
          const unit = units.find(u => u.id == item.currencyUnitId)
          return (
            <ListItem
              key={index}
              title={item.title}
              subtitle={item.description}
              rightTitle={`${item.value}${unit && unit.code}`}
              rightTitleStyle={{ color: '#000' }}
              rightIcon={editable ? { name: 'delete', color: '#E44C4C' } : null}
              hideChevron={!editable}
              onPress={() => this.removeFee(index)}
              containerStyle={{ marginLeft: 10, marginRight: 10 }}
            />
          )
        })}
        <Modal
          animationType='none'
          transparent
          visible={modal}
        >
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.setState({ modal: false })}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                opacity: 0.2
              }}
            />
            <Card
              title='Add Additional Fee'
              containerStyle={{
                width: '80%',
                height: '80%'
              }}
            >
              <ScrollView>
                <FormInput
                  placeholder='Fee title'
                  onChangeText={(text) => this.onTextChange(text, 'feeTitle')}
                />
                <FormInput
                  placeholder='Fee desciption'
                  onChangeText={(text) => this.onTextChange(text, 'feeDescription')}
                />
                <FormInput
                  placeholder='Fee value'
                  onChangeText={(text) => this.onTextChange(text, 'feeValue')}
                />
                <Dropdown
                  label='Unit'
                  data={units.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                  containerStyle={{ marginHorizontal: 16 }}
                  onChangeText={(text) => this.onTextChange(text, 'feeUnit')}
                />
                <Button title='Add' onPress={this.addFee} />
              </ScrollView>
            </Card>
          </View>
        </Modal>
      </Card>
    )
  }
}

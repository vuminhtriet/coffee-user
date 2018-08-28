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
  Button
} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'

export default class AdditionalFees extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeName: '',
      feeAmount: '',
      feeUnit: '',
      feeDescription: '',
      addNew: false
    }
    this.addNew = this.addNew.bind(this)
    this.onAddNew = this.onAddNew.bind(this)
  }

  addNew () {
    const { addNew } = this.state
    this.setState({
      addNew: !addNew
    })
  }

  onAddNew () {
    const { units = [], addFee } = this.props
    const { feeName, feeAmount, feeUnit, feeDescription } = this.state
    const unit = units.find(item => item.id === feeUnit)
    addFee && addFee({
      feeName,
      feeAmount,
      feeUnit: unit,
      feeDescription
    })
    this.setState({
      addNew: false
    })
  }

  onChangeText (text, type) {
    this.setState({
      [type]: text
    })
  }

  render () {
    const { addNew } = this.state
    const { fees = [], units = [], editable = false } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: undefined,
        height: undefined }}>
        <Text
          style={{ color: '#6F4E37', padding: 5, fontWeight: 'bold' }}>
          Additional fees
        </Text>
        {editable && <Icon
          name='add'
          onPress={this.addNew}
          color='#E44C4C'
          containerStyle={{ position: 'absolute', right: 0, top: 0 }} />}
        {fees && fees.map((fee, index) => {
          return (
            <ListItem
              key={index}
              title={fee.name}
              subtitle={fee.description}
              rightTitle={`${fee.amount} ${fee.unit && fee.unit.name}`}
              rightTitleStyle={{ color: '#000' }}
            />
          )
        })}
        <Modal
          animationType='none'
          transparent
          visible={addNew}
        >
          <View style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.setState({ addNew: false })}
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
                height: 310
              }}
            >
              <ScrollView>
                <FormInput
                  placeholder='Fee name'
                  onChangeText={(text) => this.onChangeText(text, 'feeName')}
                />
                <FormInput
                  placeholder='Fee desciption'
                  multiline
                  numberOfLines={3}
                  onChangeText={(text) => this.onChangeText(text, 'feeDescription')}
                />
                <FormInput
                  placeholder='Fee amount'
                  onChangeText={(text) => this.onChangeText(text, 'feeAmount')}
                />
                <Dropdown
                  label='Unit'
                  data={units.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                  containerStyle={{ marginHorizontal: 16 }}
                  onChangeText={(text) => this.onChangeText(text, 'feeUnit')}
                />
                <Button title='ADD' onPress={this.onAddNew} />
              </ScrollView>
            </Card>
          </View>
        </Modal>
      </Card>
    )
  }
}

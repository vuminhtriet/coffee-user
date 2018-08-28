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
  render () {
    const { fees = [], editable = false } = this.props

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
        {!fees.length && <Text style={{ paddingLeft: 5 }}>N/A</Text>}
      </Card>
    )
  }
}

import React, { Component } from 'react'
import {
  Text,
  TextInput
} from 'react-native'
import {
  Card,
  FormLabel
} from 'react-native-elements'

export default class ShopNote extends Component {
  render () {
    const { note, editable, onNoteChange } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Shop's note
        </FormLabel>
        {!editable && <Text
          style={{ height: 80, padding: 10, paddingLeft: 20 }}
        >
          {note}
        </Text>}
        {editable && <TextInput
          multiline
          numberOfLines={3}
          value={note}
          style={{ height: 80, padding: 10, paddingLeft: 20, paddingTop: 0 }}
          onChangeText={text => onNoteChange(text)}
          placeholder='Enter shop note'
        />}
      </Card>
    )
  }
}

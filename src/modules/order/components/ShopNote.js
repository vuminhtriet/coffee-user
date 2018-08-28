import React, { Component } from 'react'
import {
  Text,
  TextInput
} from 'react-native'
import {
  Card
} from 'react-native-elements'

export default class ShopNote extends Component {
  render () {
    const {
      note = '',
      editable = false,
      onChangeNote = () => {},
      placeHolder = '' } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: undefined,
        height: undefined }}>
        <Text
          style={{ color: '#6F4E37', padding: 5, fontWeight: 'bold' }}>
          Shop's note
        </Text>
        <TextInput
          multiline
          value={note}
          disabled={!editable}
          numberOfLines={10}
          style={{ height: 80, padding: 10 }}
          placeHolder={placeHolder}
          onChangeText={text => onChangeNote(text)}
        />
      </Card>
    )
  }
}

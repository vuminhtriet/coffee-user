import React, { Component } from 'react'
import {
  Card,
  FormValidationMessage
} from 'react-native-elements'

export default class ErrorMessage extends Component {
  render () {
    const { errors } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        paddingBottom: 70,
        width: undefined,
        height: undefined
      }}>
        <FormValidationMessage>
          {errors.length > 0 && errors.map(item => {
            return `${item}\n`
          })}
        </FormValidationMessage>
      </Card>
    )
  }
}

import React, { Component } from 'react'
import {
    Modal
} from 'react-native'
import ModalLoading from '../widgets/ModalLoading'

export default class ModalWrapper extends Component {
  render () {
    const { children, ...rest } = this.props
    return (
      <Modal
        {...rest}
      >
        {children}
        <ModalLoading.Component key='loading' global />
      </Modal>
    )
  }
}

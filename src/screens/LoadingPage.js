import React, { Component } from 'react'
import {
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import Loading from '../modules/dashboard/containers/Loading'

export default class LoadingPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
      >
        <Loading navigation={navigation} />
      </DefaultPage>
    )
  }
}

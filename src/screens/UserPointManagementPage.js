import React, { Component } from 'react'
import {
  View,
  Modal
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import ModalWrapper from '../common/components/elements/Modal'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import PointManagement from '../modules/user/containers/PointManagement'

export default class UserPointManagementPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openSort: false,
      chosenStatus: '',
      chosenOption: ''
    }
  }

  render () {
    // const {  } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            canBack={false} onBack={() => navigation.goBack()}
            // onSort={this.onSortType}
            title='Quản lý tích điểm'
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <PointManagement navigation={navigation}
            />
        </View>
      </DefaultPage>
    )
  }
}

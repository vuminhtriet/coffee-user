import React, { Component } from 'react'
import {
  View,
  Modal
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import ModalWrapper from '../common/components/elements/Modal'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BookManagement from '../modules/user/containers/BookManagement'
import UserBookFilter from '../modules/user/components/UserBookFilter'

export default class UserBookManagementPage extends Component {
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
            title='Đơn đặt chỗ của tôi'
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <BookManagement navigation={navigation} 
            // chosenOption={chosenOption}
            // chosenStatus={chosenStatus}
            />
        </View>
        {/* <ModalWrapper
          animationType='slide'
          transparent={false}
          visible={openSort}
        >
          <UserBookFilter
            toggleFilter={this.onFilter}
            // onFilter={this.onFilter}
            chooseOption={this.chooseOption}
            chosenOption={chosenOption}
            chooseStatus={this.chooseStatus}
            chosenStatus={chosenStatus}
          />
        </ModalWrapper> */}
      </DefaultPage>
    )
  }
}

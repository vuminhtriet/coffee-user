import React, { Component } from 'react'
import {
  View,
  Modal
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import ModalWrapper from '../common/components/elements/Modal'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BookManagement from '../modules/user/containers/BookManagement'
import SortList from '../modules/shop/components/SortList'

export default class UserBookManagementPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openSort: false
    }
    this.onSortType = this.onSortType.bind(this)
  }

  onSortType () {
    const { openSort } = this.state
    this.setState({
      openSort: !openSort
    })
  }

  render () {
    const { openSort } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            canBack={false} onBack={() => navigation.goBack()}
            onSort={this.onSortType}
            title='Đơn đặt chỗ của tôi'
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <BookManagement navigation={navigation} />
        </View>
        <ModalWrapper
          animationType='slide'
          transparent={false}
          visible={openSort}
        >
          <SortList toggleSort={this.onSortType} />
        </ModalWrapper>
      </DefaultPage>
    )
  }
}

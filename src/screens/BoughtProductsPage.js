import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BoughtProductList from '../modules/user/containers/BoughtProductList'

export default class BoughtProductsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
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
            title='My bought products'
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <BoughtProductList navigation={navigation} />
        </View>
      </DefaultPage>
    )
  }
}

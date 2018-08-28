import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchProduct'
import DefaultPage from '../common/hocs/defaultPage'
import PageCategories from '../modules/dashboard/containers/PageCategories'

export default class DashboardPage extends Component {
  render () {
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header />
        </View>
        <PageCategories />
      </DefaultPage>
    )
  }
}

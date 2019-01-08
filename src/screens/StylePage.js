import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PageStyles from '../modules/dashboard/containers/PageStyles'

export default class StylePage extends Component {

  constructor (props) {
    super(props)
  }
  
  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header onBack={this.onBack} title='Tất cả phong cách' />
        </View>
        <PageStyles />
      </DefaultPage>
    )
  }
}

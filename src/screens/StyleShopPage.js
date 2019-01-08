import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Header from '../common/components/elements/HeaderTitle'
import DefaultPage from '../common/hocs/defaultPage'
import PageStyleShops from '../modules/dashboard/containers/PageStyleShops'

export default class StyleShopPage extends Component {
  
  constructor (props) {
    super(props)
  }
  
  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    const styleId = navigation.getParam('styleId', 1)
    const styleName = navigation.getParam('styleName', 'none')

    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header onBack={this.onBack} title={styleName} />
        </View>
        <PageStyleShops styleId={styleId} />
      </DefaultPage>
    )
  }
}

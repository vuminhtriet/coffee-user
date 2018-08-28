import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import ShopInformation from '../modules/shop/containers/ShopInformation'

export default class ShopInformationPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shop: {},
      address: {}
    }
    this.changeText = this.changeText.bind(this)
    this.ready = this.ready.bind(this)
  }

  ready (shop, address) {
    this.setState({
      shop, address
    })
  }

  changeText (text, object, key) {
    const old = this.state[object]
    if (key === 'countryId') {
      return this.setState({
        [object]: {
          ...old,
          countryId: text,
          cityId: ''
        }
      })
    }
    this.setState({
      [object]: {
        ...old,
        [key]: text
      }
    })
  }

  render () {
    const { shop, address } = this.state
    const { navigation } = this.props
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Shop information'
            onBack={() => navigation.goBack()} />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <ShopInformation
            currentShop={shop}
            navigation={navigation}
            currentAddress={address}
            ready={this.ready}
            changeText={this.changeText}
          />
        </View>
      </DefaultPage>
    )
  }
}

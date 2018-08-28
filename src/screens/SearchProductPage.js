import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import Header from '../common/components/elements/HeaderSearchProduct'
import DefaultPage from '../common/hocs/defaultPage'
import PageSearchProducts from '../modules/dashboard/containers/PageSearchProducts'

export default class SearchProductsPage extends Component {
  constructor (props) {
    super(props)
    const { navigation } = props
    const keyword = navigation.getParam('keyword', '')
    this.state = {
      keyword
    }
  }
  
  onSearch = (keyword) => {
    this.setState({ keyword })
  }

  render () {
    const { keyword } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <Header onSearch={this.onSearch} keyword={keyword} />
        </View>
        <PageSearchProducts keyword={keyword} />
      </DefaultPage>
    )
  }
}

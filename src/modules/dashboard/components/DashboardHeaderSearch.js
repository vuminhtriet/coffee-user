import React, { Component } from 'react'
import {
  View,
} from 'react-native'
import { withNavigation } from 'react-navigation'

import HeaderSearch from '../../../common/components/elements/HeaderSearch'
import { SCREENS } from '../../../common/screens'

class DashboardHeaderSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  onMessage = () => {
    const { token, navigation }  = this.props
    if (!token) {
      navigation.navigate(SCREENS.AuthenticatePage)
      return
    }
    navigation.navigate(SCREENS.ChatHistoryPage)
  }

  onSearch = (keyword) => {
    this.props.navigation.navigate(SCREENS.SearchPage, { keyword: keyword })
  }

  render() {
    return (
      <View style={{ width: '100%' }}>
        <HeaderSearch
          onMessage={this.onMessage}
          onSearch={this.onSearch}
        />
      </View>
    )
  }
}

export default withNavigation(DashboardHeaderSearch)
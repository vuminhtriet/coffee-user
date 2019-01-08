import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { Icon } from 'react-native-elements'
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

  onNavigate = () => {
    const { user }  = this.props
    this.props.navigation.navigate(SCREENS.RecommendSearchPage, { user: user })
  }

  render() {
    return (
      <View 
        style={{ width: '100%' }}
      >
        {/* <HeaderSearch
          onMessage={this.onMessage}
          // onSearch={this.onSearch}
        /> */}
        <View style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#6F4E37'
        }}>
        <TouchableWithoutFeedback 
          onPress={this.onNavigate}>
          <View 
          style={{
            margin: 8,
            paddingLeft: 8,
            height: 40,
            flex: 1,
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}>
            <Icon
              name='search'
              size={26}
              style={{
                // color: '#FFFFFF',
                paddingLeft: 10
              }}
              type='font-awesome'
              color='black' />
            <Text style={{fontSize: 15, marginLeft: 8}}>
              Tìm kiếm quán cafe, đồ uống,...
            </Text>
          </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

export default withNavigation(DashboardHeaderSearch)
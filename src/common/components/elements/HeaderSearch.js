import React, { Component, PureComponent } from 'react'
import I18n from 'i18n-js'
import { View, StyleSheet } from 'react-native'
import { SearchBar } from 'react-native-elements'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Icon } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
// import ProgressBar from '../widgets/ProgressBar'

class HeaderSearch extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  _onClear = () => {
    this.setState({ text: '' })
  }

  _onChangeText = (text) => {
    this.setState({ text })
  }

  _onSearch = () => {
    const { text } = this.state
    const { onSearch } = this.props
    onSearch(text)
  }
  _onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render () {
    const {
      onBack,
      onMessage
    } = this.props
    
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <MaterialIcon
            name={'arrow-back'}
            size={26}
            style={styles.icon}
            onPress={this._onBack} />
        </View>
        <SearchBar
          searchIcon={null} // You could have passed `null` too
          onChangeText={this._onChangeText}
          onClear={this._onClear}
          onSubmitEditing={this._onSearch}
          placeholder='Tìm kiếm quán cafe, đồ uống,...'
          containerStyle={{ backgroundColor: '#6F4E37', flex: 1, borderTopWidth: 0, borderBottomWidth: 0 }}
          inputStyle={{ backgroundColor: 'white' }}
        />

        {/* <View style={styles.notificationContainer}>
          <Icon
            name='comment'
            size={26}
            style={styles.icon}
            type='font-awesome'
            color='white'
            onPress={onMessage || null} />
          <MaterialIcon
            name={'notifications'}
            size={26}
            style={styles.icon}
            onPress={onBack || null} />
        </View> */}
      </View>
    )
  }
}

export default withNavigation(HeaderSearch)

const styles = StyleSheet.create({
  notificationContainer: {
    height: 40,
    width: 90,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6F4E37'
  },
  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center'
  },
  titleContainer: {
    flex: 1,
    height: 40
  },
  icon: {
    color: '#FFFFFF',
    marginLeft: 10
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF'
  },
  inputStyle: {
    borderWidth: 0
  }
})

import React, { Component } from 'react'
import I18n from 'i18n-js'
import { View, StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation'
import { SearchBar } from 'react-native-elements'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
// import ProgressBar from '../widgets/ProgressBar'

class HeaderSearchProduct extends Component {
  constructor (props) {
    super(props)
    const { keyword } = props
    this.state = {
      text: keyword || ''
    }
  }

  componentWillReceiveProps (nextProps) {
    const { text } = this.state
    if (nextProps.keyword && nextProps.keyword !== text) {
      this.setState({ text: nextProps.keyword })
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
    const { text } = this.state
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
          searchIcon={false} // You could have passed `null` too
          onChangeText={this._onChangeText}
          onClear={this._onClear}
          onSubmitEditing={this._onSearch}
          value={text}
          placeholder='Search in TopTrade...'
          containerStyle={{ backgroundColor: '#6F4E37', flex: 1, borderTopWidth: 0, borderBottomWidth: 0 }}
          inputStyle={{ backgroundColor: 'white' }}
        />
        {/* <ProgressBar.Component key='loading' global /> */}
      </View>
    )
  }
}

export default withNavigation(HeaderSearchProduct)

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
  }
})

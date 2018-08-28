import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native'

export default class Radio extends Component {
  constructor (props) {
    super(props)
    let themeList = {
      main: 'thmMain',
      disable: 'thmDisable'
    }
    let theme = themeList['main']
    if (this.props.disabled) {
      theme = themeList['disable']
    }
    if (typeof this.props.theme === 'string' && typeof themeList[this.props.theme] != null) {
      theme = themeList[this.props.theme.replace('-', '_')]
    }
    this.state = {
      isPress: false,
      theme: theme
    }
  }

  _renderText () {
    const { children, text } = this.props
    if (children) {
      return (
        <View>{children}</View>
      )
    } else if (text) {
      return (
        <Text style={[styles.text, this.props.check ? styles.textChecked : null, this.props.textStyle]}>
          {text}
        </Text>
      )
    }
  }

  _renderCheck () {
    return (
      <View style={[styles.center, styles.checkWrap, styles[this.state.theme + 'CheckWrap'], this.props.check ? styles[this.state.theme + 'CheckedWrap'] : null]}>
        <Text style={[styles.noCheck, this.props.check ? styles[this.state.theme + 'NoChecked'] : null, this.props.check ? styles[this.state.theme + 'Checked'] : null]}>
          {this.props.check ? ' ' : ''}
        </Text>
      </View>
    )
  }

  render () {
    const { disabled, onPress, check } = this.props
    return (
      <TouchableHighlight
        style={[styles.flexRow]}
        onPress={!disabled && onPress ? onPress : null}
        underlayColor='transparent'
      >
        <View style={[styles.flexRow]}>
          {this._renderCheck()}
          {this._renderText()}
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    margin: 5
  },
  text: {
    color: '#6d7fb5',
    flexWrap: 'wrap',
    fontSize: 14,
    paddingLeft: 5,
    // fontFamily: 'NotoSans',
    paddingTop: 2,
    letterSpacing: 1.5,
    flex: 1
  },
  textChecked: {
    color: '#00caf8'
    // fontFamily: 'NotoSans'
  },
  noCheck: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 0,
    overflow: 'hidden',
    opacity: 0,
    padding: 5
  },
  checkWrap: {
    width: 22,
    height: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00caf8',
    margin: 0,
    marginRight: 10,
    backgroundColor: '#121e30'
  },
  thmMainCheckedWrap: {
    borderWidth: 1,
    borderColor: '#3e526e'
  },
  thmMainNoChecked: {
  },
  thmMainChecked: {
    backgroundColor: '#00caf8',
    opacity: 1
  },
  thmDisableCheckWrap: {
    backgroundColor: '#00caf8',
    borderColor: '#00caf8'
  },
  thmDisableNoChecked: {},
  thmDisableChecked: {
    backgroundColor: '#00caf8',
    opacity: 1
  }
})

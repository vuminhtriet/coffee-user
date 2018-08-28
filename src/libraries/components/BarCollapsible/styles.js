import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
  bar: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: 45
  },

  barWrapper: {
    alignSelf: 'stretch'
  },

  icon: {
    padding: 5,
    width: 40
  },

  title: {
    color: '#E7DFDD',
    flex: 1,
    fontSize: 15,
    paddingLeft: 15
  }
})

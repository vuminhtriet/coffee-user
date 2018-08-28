import { StyleSheet, Dimensions } from 'react-native'

const win = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  chatList: {
    backgroundColor: '#FEFEFE'
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: win.width,
    height: win.height
  }
})

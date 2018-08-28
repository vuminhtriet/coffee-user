import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
  background: {
    // ...Platform.select({
    //   ios: {
    //     top: 15
    //   },
    //   android: {
    //     top: 0
    //   }
    // }),
    top: 36,
    left: 0,
    zIndex: 9999,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'absolute'
  },
  fill: {
    height: 5,
    backgroundColor: '#ff9024'
  },
  overlay: {
    zIndex: 999,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent'
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    flex: 1
  }
})

export default styles

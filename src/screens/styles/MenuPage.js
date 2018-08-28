import {
  StyleSheet,
  Dimensions
} from 'react-native'
const { height } = Dimensions.get('window')

export default StyleSheet.create({
  barContainer: {
    flex: 1,
    width: '100%',
    maxHeight: height - 20,
    height: height - 20
    // overflow: 'hidden'
  },
  menu: {
    flex: 1,
    backgroundColor: '#061122',
    paddingTop: 60,
    paddingBottom: 20
  },
  version: {
    position: 'absolute',
    bottom: 10
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
  txtVersion: {
    color: '#6D7Fb5',
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 12
  },
  navItems: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    alignItems: 'center'
  },
  txtNav: {
    fontSize: 14,
    color: '#6d7fb5',
    fontWeight: 'normal',
    paddingLeft: 15
  },
  iconMenuContact: {
    width: 23,
    height: 15
  },
  iconMenuHelp: {
    width: 23,
    height: 21
  },
  iconMenuFeedback: {
    width: 25,
    height: 17
  },
  iconMenu: {
    width: 23,
    height: 23
  }
})

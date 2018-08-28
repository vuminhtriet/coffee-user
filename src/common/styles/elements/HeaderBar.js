import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  headerbar: {
    ...Platform.select({
      android: {
        flex: 1,
        marginTop: 0,
        marginBottom: 5
      },
      ios: {
        flex: 1.3,
        marginTop: 0
      }
    }),
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35
  },
  headerback: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerbackText: {
    marginLeft: 5,
    marginTop: 5,
    color: '#6d7fb5'
  },
  iconHeaderbar: {
    fontSize: 24,
    color: '#ffffff'
  },
  txtMenuName: {
    paddingTop: 0,
    fontSize: 16,
    color: '#fff'
  },
  btnMenu: {
    backgroundColor: 'rgba(44,66,97,0.2)',
    paddingLeft: 15,
    paddingRight: 15,
    height: 35,
    paddingTop: 5,
    paddingBottom: 5
  },
  btnMenuLeft: {
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40
  },
  btnMenuRight: {
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginTop: 6
  },
  btnMenuTransparent: {
    backgroundColor: 'transparent'
  }
})

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  feeQuestion: {
    backgroundColor: '#5F81BA',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    zIndex: 1,
    margin: 10,
    padding: 10,
    maxWidth: 300,
    maxHeight: 350,
    borderRadius: 3
  },
  txtQuestionTop: {
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  viewBtn: {
    alignItems: 'flex-end',
    paddingTop: 10
  },
  btnNext: {
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  txtNext: {
    textAlign: 'right',
    color: '#fff'
  },
  txtQuestion: {
    fontSize: 14,
    paddingTop: 1,
    color: '#fff'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#5F81BA'
  }
})

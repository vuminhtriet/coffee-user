import React from 'react'
import {
    View,
    StyleSheet
} from 'react-native'

export default ({
  onRightComponent = null,
  onLeftComponent = null
}) => {
  return (
    <View style={styles.container}>
      {
        onLeftComponent || <View />
      }
      {
        onRightComponent || <View />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#D4D4D4'
  },
  iconContainer: {
    height: 40,
    justifyContent: 'center',
    zIndex: 99
  },
  titleContainer: {
    flex: 1,
    height: 40,
    marginLeft: -26,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 10
  },
  iconRight: {
    marginRight: 10
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF'
  }
})

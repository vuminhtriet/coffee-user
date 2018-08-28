import I18n from 'i18n-js'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
// import { Icon } from 'react-native-elements'
// import ProgressBar from '../widgets/ProgressBar'

export default ({
  navigation,
  title = 'name page',
  done = null
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {done &&
        <View style={styles.filterContainer}>
          <Text style={styles.done} onPress={done}>Done</Text>
        </View>
      }
      {/* <ProgressBar.Component key='loading' global /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6F4E37'
  },
  titleContainer: {
    flex: 1,
    height: 40,
    marginLeft: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF'
  },
  done: {
    color: '#FFFFFF'
  },
  filterContainer: {
    height: 40,
    width: 90,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

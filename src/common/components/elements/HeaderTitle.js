import I18n from 'i18n-js'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
// import ProgressBar from '../widgets/ProgressBar'

export default ({
  navigation,
  onBack = null,
  title = 'name page',
  iconName = 'arrow-back',
  iconType = undefined,
  onSort = null,
  rightIcon = null
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {onBack && <Icon
          name={iconName}
          size={26}
          type={iconType}
          color='#ffffff'
          containerStyle={styles.icon}
          onPress={onBack} />}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {
            title.length > 25
            ? title.slice(0, 25) + '...'
            : title
          }
        </Text>
      </View>
      {onSort && (
        <Icon
          name={'sort'}
          size={26}
          color='#ffffff'
          containerStyle={styles.iconRight}
          onPress={onSort} />
      )}
      {rightIcon && rightIcon}
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
    marginRight: 10,
    zIndex: 99
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF'
  }
})

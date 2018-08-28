import I18n from 'i18n-js'
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

export default ({
  onBack = null,
  openShopDetail = null,
  openHome = null,
  title = '@Samsung_galaxy_store'
}) => {
  return (
    <View style={styles.outContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            name='arrow-back'
            color='#d83e3e'
            onPress={onBack}
          />
        </View>
        <TouchableOpacity style={styles.titleContainer} onPress={openShopDetail}>
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
        <Icon name='circle' type='font-awesome' color='orange' size={16.0} containerStyle={styles.status} />
      </View>
      <Icon
        name='home'
        type='font-awesome'
        size={24}
        color='#d83e3e'
        onPress={openHome}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  outContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF1F4',
    paddingRight: 10
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EFF1F4'
  },
  iconContainer: {
    height: 40,
    justifyContent: 'center',
    marginLeft: 10
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  title: {
    fontSize: 18,
    color: '#d83e3e'
  },
  status: {
    marginLeft: 15
  }
})

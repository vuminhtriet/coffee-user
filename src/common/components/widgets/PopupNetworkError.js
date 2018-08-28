import I18n from 'i18n-js'
import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import Button from '../elements/Button'
import Ion from 'react-native-vector-icons/Ionicons'

export default class PopupNetworkError extends PureComponent {
  static navigatorStyle = {
    statusBarHideWithNavBar: false,
    statusBarTextColorScheme: 'white',
    statusBarTextColorSchemeSingleScreen: 'light',
    navBarHidden: true,
    drawUnderNavBar: true,
    navBarTranslucent: true
  }

  componentWillMount() {
    if (this.props.networkErrorCallback){
      this.props.networkErrorCallback(true)
    }
  }

  componentWillUnmount() {
    if (this.props.networkErrorCallback) {
      this.props.networkErrorCallback(false)
    }
  }

  closeModal() {
    if (Platform.OS.toLowerCase() === 'ios') {
      Navigation.dismissLightBox({})
    }
    else {
      Navigation.dismissModal({})
    }
  }

  render() {
    return (
      <View style={styles.popNetwork}>
        <View style={styles.popNetworkError}>
          <Ion name={'ios-alert-outline'} style={styles.iconWarning} />
          <Text style={[styles.lbTitleTop, styles.lbBottom]}>{I18n.t('common.network_error')} </Text>
          <Button
              title={I18n.t('common.ok').toUpperCase()}
              onPress={() => this.closeModal()}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  popNetwork: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  popNetworkError: {
    padding: 15,
    width: 280,
    borderRadius: 3,
    justifyContent: 'center',
    backgroundColor: '#1C2E47',
    minHeight: 200
  },
  iconWarning: {
    textAlign: 'center',
    fontSize: 45,
    paddingBottom: 10,
    color: '#9CB4E3'
  },
  lbTitleTop: {
    color: '#9CB4E3',
    textAlign: 'center',
    fontSize: 14,
    //fontFamily: 'NotoSans',
    fontWeight: 'bold',
    paddingBottom: 5
  },
  lbBottom: {
    paddingBottom: 20,
    //fontFamily: 'NotoSans'
  }
})
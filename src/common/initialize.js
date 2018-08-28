import I18n from 'i18n-js'
import DeviceInfo from 'react-native-device-info'
import { setUserLanguage } from './actions/common'
import { DEFAULT_LANGUAGE } from './models'

I18n.defaultLocale = DEFAULT_LANGUAGE
I18n.fallbacks = true
I18n.translations = {
  ja: require('../assets/lang/ja.json'),
  en: require('../assets/lang/en.json')
}

export default async function (dispatch, locale = null) {
  try {
    const deviceLocale = DeviceInfo && DeviceInfo.getDeviceLocale().substring(0, 2)
    const appLocale = locale || deviceLocale || DEFAULT_LANGUAGE
    I18n.locale = appLocale
    dispatch && dispatch(setUserLanguage(appLocale))
  } catch (error) {
    I18n.locale = locale || DEFAULT_LANGUAGE
    dispatch && dispatch(setUserLanguage(locale || DEFAULT_LANGUAGE))
  }
}

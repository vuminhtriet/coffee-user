import { Platform } from 'react-native'
import { Navigation } from 'react-navigation'

export function routeTo (targetScreen, type = 'push') {
  return {
    screen: targetScreen,
    animated: true,
    backButtonHidden: true,
    type: type,
    route: {
      key: targetScreen,
      title: targetScreen
    },
    navigatorStyle: { screenBackgroundColor: '#E7DFDD' },
    animationType: 'fade'
  }
}

export function push (navigator, screen, options = {}) {
  requestAnimationFrame(() => {
    navigator && navigator.push({
      ...routeTo(screen),
      ...options
    })
  })
}

export function resetTo (navigator, screen, options = {}) {
  requestAnimationFrame(() => {
    navigator && navigator.resetTo({
      ...routeTo(screen),
      ...options
    })
  })
}

export function showPopup (screen, config, props) {
  if (Platform.OS.toLowerCase() === 'ios') {
    requestAnimationFrame(() => {
      Navigation.showLightBox({
        screen,
        passProps: {
          onBack: () => {
            Navigation.dismissLightBox({
              animationType: 'none'
            })
          },
          ...props
        },
        style: {
          backgroundBlur: 'light',
          backgroundColor: 'rgba(0,0,0,0.1)'
        },
        ...config
      })
    })
  } else {
    requestAnimationFrame(() => {
      Navigation.showModal({
        screen,
        overrideBackPress: true,
        passProps: {
          onBack: () => {
            Navigation.dismissAllModals({
              animationType: 'none'
            })
          },
          ...props
        },
        ...config
      })
    })
  }
}

export function closePopup () {
  Navigation.dismissLightBox({
    animationType: 'none'
  })
  Navigation.dismissAllModals({
    animationType: 'none'
  })
}

export function showLoadingPopup (screen, config, props) {
  Navigation.showModal({
    screen,
    overrideBackPress: true,
    animationType: 'none',
    passProps: {
      onBack: () => {
        Navigation.dismissAllModals({
          animationType: 'none'
        })
      },
      ...props
    },
    navigatorStyle: {
      screenBackgroundColor: 'transparent',
      modalPresentationStyle: 'overCurrentContext'
    },
    ...config
  })
}

export async function closeLoadingPopup () {
  await Navigation.dismissAllModals({
    animationType: 'none'
  })
}

// TODO: improve it , because react-native-navigation do not support passProps on pop function
export let passProps = {}

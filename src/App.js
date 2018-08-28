import React, { Component } from 'react'
import {
  AppState,
  DeviceEventEmitter
} from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import store from './common/store'
import './common/utils/logger'
import InitialPage from './common/hocs/InitialPage'

// Pure class no need Component
class App extends Component {
  constructor (props) {
    super(props)
    this.onAppPause = this.onAppPause.bind(this)
    this.onAppResume = this.onAppResume.bind(this)
    this.onAppStateChange = this.onAppStateChange.bind(this)
    DeviceEventEmitter.addListener('deviceResume', this.onAppResume)
    DeviceEventEmitter.addListener('devicePause', this.onAppPause)
    AppState.addEventListener('change', this.onAppStateChange)
  }

  onAppStateChange (currentAppState) {
    console.log('_onAppStateChange', currentAppState)
  }

  onAppResume () {
    console.log('onAppResume')
  }

  onAppPause () {
    console.log('onAppPause')
  }

  render () {
    return (
      <Provider store={store.store}>
        <PersistGate persistor={store.persistor}>
          <InitialPage persistor={store.persistor} />
        </PersistGate>
      </Provider>
    )
  }
}

export default App

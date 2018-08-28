import React, { PureComponent } from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'
import initialize from '../initialize'
import Migrator from '../migrator'
// import logger from '../utils/logger'
import storage from '../utils/storage'
import { SETTING_KEYS, SETTING_STORE } from '../models'
import { updateSetting } from '../actions/common'
import Navigator from '../screens'
import PageLoading from '../components/widgets/PageLoading'
import ModalLoading from '../components/widgets/ModalLoading'

class InitialPage extends PureComponent {
  async componentDidMount () {
    const { dispatch } = this.props
    let settings = {}
    try {
      // TODO: Load setting from asyncStorage
      await storage.init(SETTING_STORE)
      settings = storage.getCurrentStore()
      dispatch(updateSetting(settings))
      // TODO: Logging system start
      // logger.init()
      // TODO: Language system start
      await initialize(dispatch, settings[SETTING_KEYS.language] || null)
      // TODO: Migration system start
      await Migrator.init()
    } catch (error) {
      console.log('Faital Error. Cannot Initialize.', error)
    }
  }

  render () {
    const { dispatch, token } = this.props
    // TODO: Loading page
    const navigation = ReactNavigation.addNavigationHelpers({
      dispatch
    })
    return [
      <Navigator key='main' navigation={navigation} token={token} />,
      <PageLoading.Component key='loading' global />,
      <ModalLoading.Component key='loading-modal' global />
    ]
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch
})

const mapStateToProps = state => ({
  token: state.user.token
})

export default connect(mapStateToProps, mapDispatchToProps)(InitialPage)

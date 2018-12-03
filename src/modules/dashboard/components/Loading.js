import React, { Component } from 'react'
import {
} from 'react-native'
import { SCREENS } from '../../../common/screens'
import FadeLoadingPage from '../../../common/components/pages/FadeLoadingPage'

export default class Loading extends Component {
  async componentDidMount () {
    const {
      navigation,
      getCountries,
      getCategories,
      getPaymentTypes,
      getCurrencyUnits,
      getShippingTypes,
      getCities,
      getDefaultLocation,
      getStyle
    } = this.props
    await Promise.all([
      // getCountries().catch(() => { }),
      // getPaymentTypes().catch(() => { }),
      // getCurrencyUnits().catch(() => { }),
      // getCategories().catch(() => { }),
      // getShippingTypes().catch(() => { })
      getCities().catch(() => { }),
      getDefaultLocation().catch(() => { }),
      getStyle().catch(() => { })
    ])
    navigation.navigate(SCREENS.TabStack)
  }
  render () {
    return (<FadeLoadingPage />)
  }
}

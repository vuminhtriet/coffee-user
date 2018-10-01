import React, { Component } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import DefaultPage from '../../../common/hocs/defaultPage'
import StoreImages from './StoreImages'
import StoreTitle from './StoreTitle'
import StoreContact from './StoreContact'
import StoreSummary from './StoreSummary'
import StorePayment from './StorePayment'
import StoreShipping from './StoreShipping'

export default class StoreInformation extends Component {
  render () {
    const { detail, shippingTypes, paymentTypes } = this.props
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ flex: 1 }}>
          {detail &&
            <ScrollView>
              <StoreImages images={detail.shopFeaturedImages} />
              <StoreTitle shop={detail} />
              <StoreContact shop={detail} />
              <StoreSummary shop={detail} />
              <StorePayment shop={detail} paymentTypes={paymentTypes} />
              <StoreShipping shop={detail} shippingTypes={shippingTypes} />
            </ScrollView>
          }
        </View>
      </DefaultPage>
    )
  }
}

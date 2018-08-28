import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'
import {
  ButtonGroup,
  ListItem
} from 'react-native-elements'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import { ORDER_STATUS, SHIPING_STATUS, PAYMENT_STATUS } from '../models'

export default class Status extends Component {
  constructor (props) {
    super(props)
    this.updateStatus = this.updateStatus.bind(this)
    this.setStatus = this.setStatus.bind(this)

    this.buttons = Object.keys(ORDER_STATUS).map(item => ORDER_STATUS[item])
  }

  setStatus (status, type) {
    const { setStatus } = this.props
    setStatus(status, type)
  }

  updateStatus (index) {
    const { setStatus } = this.props
    setStatus(Object.keys(ORDER_STATUS)[index], 'status')
  }

  render () {
    const {
      onBack,
      orderStatus,
      shippingStatus,
      paymentStatus
    } = this.props

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          paddingTop: 20 }}
        >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Cart detail'
            onBack={onBack} />
        </View>
        <View
          style={{ flex: 1 }}
        >
          <ScrollView>
            <ButtonGroup
              onPress={this.updateStatus}
              selectedIndex={orderStatus}
              buttons={this.buttons}
              containerStyle={{height: 100}}
            />
            <Text
              style={{ color: '#6F4E37', padding: 5, paddingVertical: 10, fontWeight: 'bold' }}>
              Shipping status
            </Text>
            {Object.keys(SHIPING_STATUS).map(key => {
              return (
                <ListItem
                  title={SHIPING_STATUS[key]}
                  rightIcon={{
                    name: 'check',
                    color: shippingStatus === key ? 'green' : '#3997E4'
                  }}
                  onPress={() => this.setStatus(key, 'shippingStatus')}
                />
              )
            })}
            <Text
              style={{ color: '#6F4E37', padding: 5, paddingVertical: 10, fontWeight: 'bold' }}>
              Payment status
            </Text>
            {Object.keys(PAYMENT_STATUS).map(key => {
              return (
                <ListItem
                  title={PAYMENT_STATUS[key]}
                  rightIcon={{
                    name: 'check',
                    color: paymentStatus === key ? 'green' : '#3997E4'
                  }}
                  onPress={() => this.setStatus(key, 'paymentStatus')}
                />
              )
            })}
          </ScrollView>
        </View>
      </View>)
  }
}

import React, { Component } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import {
  ListItem
} from 'react-native-elements'
import HeaderFilter from '../../../common/components/elements/HeaderFilter'
import { SHIPPING_STATUS_MAP, SHIPPING_STATUS, ORDER_STATUS } from '../../../common/models'

export default class ShippingStatus extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shippingStatus: this.props.shippingStatus
    }
  }

  setStatus = () => {
    const { setStatus } = this.props
    const { shippingStatus } = this.state
    setStatus(shippingStatus)
  }

  render () {
    const { shippingStatus, orderStatus } = this.state
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#fff' }}
        >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderFilter
            title='Shipping status'
            done={this.setStatus} />
        </View>
        <View
          style={{ flex: 1 }}
        >
          <ScrollView>
            {Object.keys(SHIPPING_STATUS_MAP).map(key => {
              return (
                <ListItem
                  key={key}
                  title={SHIPPING_STATUS_MAP[key]}
                  rightIcon={{
                    name: 'check',
                    color: 'green'
                  }}
                  disabled={orderStatus == ORDER_STATUS.COMPLETE && key != SHIPPING_STATUS.RETURN ? true : false}
                  hideChevron={Number(shippingStatus) === Number(key) ? false : true}
                  onPress={() => this.setState({ shippingStatus: key })}
                />
              )
            })}
          </ScrollView>
        </View>
      </View>)
  }
}

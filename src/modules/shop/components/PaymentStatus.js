import React, { Component } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import {
  ListItem
} from 'react-native-elements'
import HeaderFilter from '../../../common/components/elements/HeaderFilter'
import { PAYMENT_STATUS_MAP } from '../../../common/models'

export default class PaymentStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paymentStatus: this.props.paymentStatus
    }
  }

  setStatus = () => {
    const { setStatus } = this.props
    const { paymentStatus } = this.state
    setStatus(paymentStatus)
  }

  render() {
    const { paymentStatus } = this.state
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderFilter
            title='Payment status'
            done={this.setStatus} />
        </View>
        <View
          style={{ flex: 1 }}
        >
          <ScrollView>
            {Object.keys(PAYMENT_STATUS_MAP).map(key => {
              return (
                <ListItem
                  key={key}
                  title={PAYMENT_STATUS_MAP[key]}
                  rightIcon={{
                    name: 'check',
                    color: 'green'
                  }}
                  hideChevron={Number(paymentStatus) === Number(key) ? false : true}
                  onPress={() => this.setState({ paymentStatus: key })}
                />
              )
            })}
          </ScrollView>
        </View>
      </View>)
  }
}

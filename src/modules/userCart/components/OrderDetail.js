import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView
} from 'react-native'
import {
  Icon,
  FormLabel
} from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import Details from './Details'
import General from './General'
import Shipment from './Shipment'
import Delivery from '../containers/Delivery'
import AdditionalFees from '../containers/AdditionalFees'
import PaymentMethods from './PaymentMethods'
import UserNote from './UserNote'
import ShopNote from './ShopNote'

export default class OrderDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  render () {
    const { onBack, order = {} } = this.props
    return (
      <DefaultPage>
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Order detail'
            onBack={onBack} />
        </View>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1 }}
        >
          <ScrollView>
            <General
              id={order.id}
              date={order.date}
              status={order.status}
              userStatus={order.userStatus}
              proofs={order.proofs}
              user={order.user}
              statusComponent={[
                <Icon
                  key='icon'
                  size={24}
                  name='access-time'
                  color='#E44C4C'
                />,
                <FormLabel key='label' labelStyle={{ fontSize: 10, maxWidth: 100, textAlign: 'center', marginTop: 0 }}>
                  In Progress
                </FormLabel>
              ]}
            />
            <Details
              editable={false}
              details={order.details}
              quantity={order.quantity}
              total={order.total}
            />
            <Shipment shipment={order.shipment} />
            <AdditionalFees fees={order.fees} />
            <View
              style={{
                width: '100%',
                backgroundColor: '#EFF1F4',
                borderColor: '#989999',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                flexDirection: 'row',
                padding: 10
              }}
            >
              <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold', color: '#1A86E0' }}>
                Total
              </Text>
              <Text style={{ flex: 1, fontSize: 22, color: '#E55554', textAlign: 'right' }}>
                {order.totalAmount}
              </Text>
            </View>
            <PaymentMethods
              title='USD payment methods'
              payments={order.payments.filter((item) => {
                return item.unit.key === 'usd'
              })}
            />
            <Delivery
              delivery={order.delivery}
            />
            <PaymentMethods
              title={`Buyer's payment methods`}
              payments={order.buyerPayments}
            />
            <UserNote note={order.userNode || 'No note'} editable={false} />
            <ShopNote note={order.shopNode || 'No note'} editable={false} />
          </ScrollView>
        </KeyboardAvoidingView>
      </DefaultPage>)
  }
}

import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native'
import {
  Card,
  Icon,
  FormLabel,
  Avatar,
  ListItem
} from 'react-native-elements'
// import { Dropdown } from 'react-native-material-dropdown'
import { SHIPING_STATUS, PAYMENT_STATUS } from '../models'
import Status from './Status'

export default class General extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      modalStatus: false
    }
    // this.status = Object.keys(ORDER_STATUS).map(key => {
    //   return {
    //     value: key,
    //     label: ORDER_STATUS[key]
    //   }
    // })
    this.requestChangeStatus = this.requestChangeStatus.bind(this)
    this.onChangeStatus = this.onChangeStatus.bind(this)
  }
  requestChangeStatus () {
    const { modalStatus } = this.state
    this.setState({
      modalStatus: !modalStatus
    })
  }
  onChangeStatus (status, type) {
    const { onChangeStatus } = this.props
    onChangeStatus(status, type)
    this.setState({
      modalStatus: false
    })
  }
  render () {
    const { modalStatus } = this.state
    const {
      id,
      date,
      status,
      user,
      proofs,
      editable = false,
      paymentStatus,
      shippingStatus,
      statusComponent,
      statusInformation = true
    } = this.props
    return [
      <Card
        key='information'
        containerStyle={{
          margin: 0,
          padding: 0,
          width: undefined,
          height: undefined }}>
        <View
          style={{ position: 'absolute', right: -10, top: 10 }}
        >
          {statusComponent.map(item => item)}
        </View>
        {id && <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', fontSize: 22, padding: 0 }}>
          OrderId: {id}
        </FormLabel>}
        <FormLabel
          containerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        >
          Order date: {date}
        </FormLabel>
        <TouchableOpacity
          style={{
            width: undefined,
            height: 60,
            flexDirection: 'row',
            margin: 15
          }}
        >
          <Avatar
            medium
            rounded
            source={{ uri: 'https://image3.mouthshut.com/images/imagesp/925881793s.jpg' }}
          />
          <View
            style={{
              flex: 1,
              height: 60,
              flexDirection: 'column',
              paddingHorizontal: 20,
              paddingVertical: 0
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
              {user.name}
            </Text>
            <Text style={{
              color: user.online === 0 ? '#E44C4C' : '#6F4E37',
              fontSize: 20
            }}>
              {user.online === 1 ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Icon
            name='navigate-next'
            size={30}
            containerStyle={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </Card>,
      statusInformation && <Card
        key='status'
        containerStyle={{
          margin: 0,
          paddingBottom: 0,
          width: undefined,
          height: undefined }}>
        <ListItem
          key='shipping-status'
          leftIcon={{
            name: 'local-shipping'
          }}
          rightIcon={{
            name: 'pencil',
            type: 'foundation'
          }}
          onPress={editable ? this.requestChangeStatus : null}
          title='Shipping status'
          rightTitle={`${SHIPING_STATUS[shippingStatus]}`}
        />
        <ListItem
          key='payment-status'
          leftIcon={{
            name: 'money',
            type: 'font-awesome'
          }}
          rightIcon={{
            name: 'pencil',
            type: 'foundation'
          }}
          title='Payment status'
          rightTitle={`${PAYMENT_STATUS[paymentStatus]}`}
        />
        <ListItem
          key='payment-proof'
          leftIcon={{
            name: 'chevron-small-right',
            type: 'entypo'
          }}
          rightIcon={{
            name: 'more-horiz'
          }}
          title='Payment proof'
          rightTitle={`${proofs ? 'Summited' : 'None'}`}
        />
      </Card>,
      <Modal
        key='modal-status'
        animationType='none'
        transparent
        visible={modalStatus}
      >
        {/* <View style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => this.setState({ addNew: false })}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              opacity: 0.2
            }}
          />
          <Card
            title='Change order status'
            containerStyle={{
              width: '80%',
              height: 310
            }}
          >
            <Dropdown
              label='Status'
              data={this.status}
              containerStyle={{ marginHorizontal: 16 }}
              onChangeText={(status) => this.onChangeStatus(status)}
            />
          </Card>
        </View> */}
        <Status
          status={status}
          paymentStatus={paymentStatus}
          shippingStatus={shippingStatus}
          setStatus={this.onChangeStatus}
        />
      </Modal>
    ]
  }
}

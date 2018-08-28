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
    }
  }

  render () {
    const {
      shop
    } = this.props

    return (
      <Card
        key='information'
        containerStyle={{
          margin: 0,
          padding: 0,
          width: undefined,
          height: undefined
        }}
      >
        <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
          <Text>Sold by</Text>
        </View>
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
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {shop.name}
            </Text>
            <Text style={{
              color: '#6F4E37',
              fontSize: 14
            }}>
              {'Online'}
            </Text>
          </View>
        </TouchableOpacity>
      </Card>
    )
  }
}

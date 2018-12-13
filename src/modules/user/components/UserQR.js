import moment from 'moment'
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image
} from 'react-native'
import QRCode from 'react-native-qrcode'
import { TEST_URL } from '../../../common/models'
import axios from 'axios'
import DatePicker from 'react-native-datepicker'
import MultiSelect from '../../../libraries/components/MultipleSelect'
import { Dropdown } from 'react-native-material-dropdown'
import {
  Icon,
  Card,
  FormLabel,
  FormInput,
  Button,
  FormValidationMessage
} from 'react-native-elements'
import { isEmpty } from 'lodash'

export default class UserInformation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      qrcode: null
    }
  }

  componentDidMount(){
  }

  render () {
    const { navigation, user } = this.props
    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 300,
            height: 300,
            zIndex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}>
          <QRCode
            value={user.id || ''}
            size={250}
          />
        </View>
      </View>
    )
  }
}

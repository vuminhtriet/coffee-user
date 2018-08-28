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
  ListItem,
  Button
} from 'react-native-elements'
import ProofList from './ProofList';
import moment from 'moment';
import {
  CART_STATUS
} from '../../../common/models';
import { withNavigation } from 'react-navigation';
import { SCREENS } from '../../../common/screens';

class General extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalProofs: false
    }
  }

  requestChangeProofs = () => {
    const { modalProofs } = this.state
    this.setState({
      modalProofs: !modalProofs
    })
  }

  onImageUpload = (image) => {
    const { onImageUpload } = this.props
    onImageUpload(image)
  }

  onProofsBack = () => {
    this.setState({
      modalProofs: false
    })
  }

  navigateStore = (id) => {
    const { navigation, onBack } = this.props
    onBack && onBack()
    navigation.navigate({ routeName: SCREENS.StoreDetail, key: SCREENS.StoreDetail, params: { id } })
  }

  render() {
    const { modalProofs } = this.state
    const {
      id,
      date,
      status,
      user,
      shop,
      payments,
      statusComponent,
      images,
      editable,
      logo
    } = this.props
    const isProof = payments.find(p => p.proofs.length > 0)
    return [
      <Card
        key='information'
        containerStyle={{
          margin: 0,
          padding: 0,
          width: undefined,
          height: undefined
        }}>
        <View
          style={{ position: 'absolute', right: -10, top: 10 }}
        >
          {statusComponent.map(item => item)}
        </View>
        {id && <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', fontSize: 22, padding: 0 }}>
          CartID: {id}
        </FormLabel>}
        <FormLabel
          containerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        >
          Date: {moment(date).format("LLL")}
        </FormLabel>
        <TouchableOpacity
          style={{
            width: undefined,
            height: 60,
            flexDirection: 'row',
            margin: 15,
            paddingLeft: 5
          }}
          onPress={() => user ? {} : this.navigateStore(shop.id)}
        >
          <Avatar
            medium
            rounded
            source={logo && logo.fullUrl
              ? { uri: logo.fullUrl }
              : require('../../../assets/placeholder.png')
            }
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
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              {user ? user.displayName : shop.name}
            </Text>
            <Text style={{
              color: user && user.online === 0 ? '#E44C4C' : '#6F4E37',
              fontSize: 14
            }}>
              {'Online'}
            </Text>
          </View>
          <Icon
            name='navigate-next'
            size={30}
            containerStyle={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </Card>,
      // <Card
      //   key='proofs'
      //   containerStyle={{
      //     margin: 0,
      //     padding: 0,
      //     width: undefined,
      //     height: undefined
      //   }}>
      //   {status === CART_STATUS.WAITING_FOR_PAYMENT_PROOF && <ListItem
      //     key='payment-proof'
      //     leftIcon={{
      //       name: 'certificate',
      //       type: 'font-awesome'
      //     }}
      //     onPress={this.requestChangeProofs}
      //     title='Payment proof'
      //     containerStyle={{ marginLeft: 10, marginRight: 10 }}
      //     rightTitle={`${isProof ? 'Submitted' : 'None'}`}
      //   />}
      // </Card>,

      // shop && status === CART_STATUS.WAITING_FOR_PAYMENT_PROOF &&
      // <View style={{ width: '100%', flex: 1 }}>
      //   <Button
      //     title='Add payment proof'
      //     backgroundColor='#E64B47'
      //     containerViewStyle={{ width: '90%', marginVertical: 10 }}
      //     onPress={this.requestChangeProofs}
      //     titleStyle={{ fontSize: 18 }}
      //   />
      //   {images && images.length > 0 &&
      //     <Text style={{ color: '#67B6F4', paddingHorizontal: 15 }}>
      //       Please press the checkout button to complete your order
      //     </Text>
      //   }
      // </View>,
      // <Modal
      //   key='modal-proofs'
      //   animationType='none'
      //   transparent
      //   visible={modalProofs}
      // >
      //   <ProofList
      //     editable={editable}
      //     onImageUpload={this.onImageUpload}
      //     images={images}
      //     data={payments}
      //     onBack={this.onProofsBack}
      //   />
      // </Modal>
    ]
  }
}

export default withNavigation(General)
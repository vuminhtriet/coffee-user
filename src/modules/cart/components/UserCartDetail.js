import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native'
import {
  Icon,
  FormLabel
} from 'react-native-elements'
import Details from './Details'
import General from './General'
import ShippingInfo from './ShippingInfo'
import Delivery from '../containers/Delivery'
import AdditionalFees from './AdditionalFees'
import PaymentMethods from './PaymentMethods'
import UserNote from './UserNote'
import ShopNote from './ShopNote'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubMenu from '../containers/SubMenu';
import ErrorMessage from './ErrorMessage';
import {
  CART_STATUS,
  CART_STATUS_MAP,
  PAYMENT_TYPE
} from '../../../common/models';
import { mapSeries } from 'async';
import { uploadProofImage } from '../../../common/firebase';
import moment from 'moment';

const MAX_TIME = 2000
export default class UserCartDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      loading: true,
      refreshing: false
    }
    this.timeout = null
  }

  async componentDidMount() {
    const { getCartDetail, id, token, getCarts, onBack } = this.props
    id && token && await getCartDetail(id, token)
    // const { cart } = this.props
    // if (cart.status < 0) {
    //   await getCarts()
    //   this.setState({ loading: false })
    //   onBack()
    // }
    // else {
    //   this.setState({ loading: false })
    // }
    this.setState({ loading: false })
  }

  onRefresh = () => {
    const { getCartDetail, id, token, getCarts, onBack } = this.props
    this.setState({
      refreshing: true,
      loading: true
    }, async () => {
      await getCartDetail(id, token)
      // const { cart } = this.props
      // if (cart.status < 0 || cart.status === 4) {
      //   await getCarts()
      //   this.setState({
      //     refreshing: false,
      //     loading: false
      //   })
      //   onBack()
      // }
      // else {
      //   this.setState({
      //     refreshing: false,
      //     loading: false
      //   })
      // }
      this.setState({
        refreshing: false,
        loading: false
      })
    })
  }

  deleteCart = async (id) => {
    const { deleteCart, token, onBack, getCarts } = this.props
    Alert.alert(
      'Confirm',
      'Do you want to delete cart?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
            await deleteCart(id, token)
            await getCarts()
            this.setState({ loading: false })
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  checkoutCart = async (id, status) => {
    const { checkoutCart, token, onBack, getCarts, cart } = this.props
    const { images } = this.state
    const lstPayments = cart.shoppingCartPayments
      .filter(item => item.paymentType.renderType !== PAYMENT_TYPE.COD)
      .map(item => item.id)
    const lstImagePayments = images
      .filter(item => lstPayments.includes(item.paymentId))
      .reduce((x, item) => {
        const isExisted = x.find(elem => elem.paymentId === item.paymentId)
        if (isExisted) {
          return x
        }
        else {
          return [...x, item]
        }
      }, [])
    // Alert.alert(
    //   'Confirm',
    //   'Do you want to checkout cart?',
    //   [
    //     { text: 'Cancel', onPress: () => { } },
    //     {
    //       text: 'OK', onPress: async () => {
    //         this.setState({ loading: true })
    //         if (status === CART_STATUS.WAITING_FOR_PAYMENT_PROOF && images.length === 0) {
    //           this.setState({ loading: false }, () =>
    //             Alert.alert(
    //               'Warning',
    //               'You have not updated proof yet'
    //             )
    //           )
    //         }
    //         else if (status === CART_STATUS.READY_TO_CHECKOUT) {
    //           const data = {
    //             images: []
    //           }
    //           await checkoutCart(id, data, token)
    //           await getCarts()
    //           this.setState({ loading: false })
    //           onBack()
    //         }
    //         else if (!(lstImagePayments.length === lstPayments.length)) {
    //           Alert.alert(
    //             'Warning',
    //             'You have not update enough proofs',
    //             [
    //               { text: 'OK', onPress: () => this.setState({ loading: false }) }
    //             ],
    //             { cancelable: false }
    //           )
    //         }
    //         else {
    //           mapSeries(images, (item, cb) => {
    //             const paymentId = item.paymentId
    //             uploadProofImage(
    //               paymentId,
    //               item.fileName,
    //               item.resized
    //                 ? item.resized.uri
    //                 : item.fileUri
    //             )
    //               .then(response => {
    //                 const image = {
    //                   url: response.ref,
    //                   fullUrl: response.downloadURL,
    //                   size: response.totalBytes,
    //                   shoppingCartPaymentId: paymentId,
    //                   createdAt: moment().format()
    //                 }
    //                 cb(null, image)
    //               })
    //               .catch(err => {
    //                 cb(err)
    //               })
    //           }, async (err, results) => {
    //             if (err) {
    //               this.setState({ loading: false })
    //             }
    //             else {
    //               const data = {
    //                 images: results
    //               }
    //               await checkoutCart(id, data, token)
    //               await getCarts()
    //               this.setState({ loading: false })
    //               onBack()
    //             }
    //           })
    //         }
    //       }
    //     }
    //   ],
    //   { cancelable: false }
    // )

    Alert.alert(
      'Confirm',
      'Do you want to checkout cart?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
            const data = {
              images: []
            }
            await checkoutCart(id, data, token)
            await getCarts()
            this.setState({ loading: false })
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  onImageUpload = (image) => {
    const images = [...this.state.images, image]
    this.setState({ images })
  }

  onNoteChange = (note) => {
    this.setState({ buyerNote: note })
  }

  renderStatus = (status) => {
    const icon = {
    }
    switch (status) {
      case 0:
        icon.name = 'shopping-basket'
        break
      case 1:
        icon.name = 'access-time'
        break
      case 2:
      case 3:
        icon.name = 'check-circle'
        icon.color = 'green'
        break
      default:
        icon.name = 'x-circle'
        icon.type = 'foundation'
        break
    }
    return [
      <Icon
        key='icon'
        size={24}
        color='#E44C4C'
        {...icon}
      />,
      <FormLabel key='label' labelStyle={{ fontSize: 10, maxWidth: 100, textAlign: 'center', marginTop: 0 }}>
        {CART_STATUS_MAP[status]}
      </FormLabel>
    ]
  }

  render() {
    const { onBack, units, cart } = this.props
    const { images, loading, refreshing } = this.state
    return (
      <DefaultPage style={{ flexDirection: 'row' }}>
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Cart detail'
            onBack={onBack} />
        </View>

        {cart && !loading &&
          <View style={{ flex: 1 }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  title='Loading...'
                />
              }
            >
              <General
                id={cart.id}
                date={cart.updatedAt}
                status={cart.status}
                payments={cart.shoppingCartPayments}
                shop={cart.shop}
                logo={cart.shop.images.find(item => item.type === 1)}
                statusComponent={this.renderStatus(cart.status)}
                onImageUpload={this.onImageUpload}
                images={images}
                editable={true}
                onBack={onBack}
              />

              <Details
                details={cart.shoppingCartDetails}
                subTotalAmount={cart.subTotalAmount}
                totalItem={cart.totalItem}
                editable={false}
                onBack={onBack}
              />

              {cart.cartAdditionalFees && cart.cartAdditionalFees.length > 0 &&
                <AdditionalFees
                  fees={cart.cartAdditionalFees}
                  editable={false}
                  units={units}
                />
              }

              <View
                style={{
                  width: '100%',
                  backgroundColor: '#EFF1F4',
                  borderColor: '#989999',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  padding: 10,
                  paddingLeft: 20
                }}
              >
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', color: '#1A86E0' }}>
                  Total
                </Text>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', color: '#E55554', textAlign: 'right' }}>
                  {cart.totalAmount}
                </Text>
              </View>

              <PaymentMethods
                payments={cart.shoppingCartPayments}
                editable={false}
              />

              <Delivery
                delivery={cart.shopShippingType}
                shopId={cart.shop.id}
                editable={false}
                shopShippingTypes={cart.shop.shopShippingTypes}
              />

              <ShippingInfo
                user={cart.user}
                address={cart.address}
                editable={false}
              />

              <UserNote
                note={cart.buyerNote || 'No note'}
                editable={false}
                onNoteChange={this.onNoteChange}
              />

              <ShopNote
                note={cart.shopNote || 'No note'}
                editable={false}
                onNoteChange={this.onNoteChange}
              />

              <ErrorMessage errors={[]} />

              {/* {[CART_STATUS.WAITING_FOR_PAYMENT_PROOF, CART_STATUS.READY_TO_CHECKOUT].includes(cart.status) &&
                <View style={{ marginTop: 7, marginBottom: 7, height: 80 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#992320', width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                    onPress={() => this.checkoutCart(cart.id, cart.status)}>
                    <Text style={{ color: '#fff' }}>Checkout</Text>
                  </TouchableOpacity>
                </View>
              } */}
            </ScrollView>
            <SubMenu
              deleteCart={() => this.deleteCart(cart.id)}
              checkoutCart={cart.status !== CART_STATUS.TO_BE_CONFIRMED && cart.status !== CART_STATUS.REJECT ? () => this.checkoutCart(cart.id, cart.status) : null}
              id={cart.shop.userId}
              status={cart.status}
              onBack={onBack}
            />
          </View>
        }

        {loading && <View style={{
          justifyContent: 'center',
          padding: 10,
          alignItems: 'center',
          alignContent: 'center',
          height: '100%',
          flex: 1
        }}>
          <ActivityIndicator size="large" color="#6F4E37" />
        </View>}
      </DefaultPage >
    )
  }
}

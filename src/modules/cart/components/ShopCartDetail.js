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
  FormLabel,
  FormValidationMessage
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

const MAX_TIME = 2000
export default class ShopCartDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fees: [],
      shopNote: '',
      totalAmount: '',
      errors: [],
      loading: true,
      refreshing: false
    }
    this.timeout = null
  }

  async componentDidMount() {
    const { getCartDetail, id, token, getCarts, onBack } = this.props
    id && token && await getCartDetail(id, token)
    const { cart } = this.props
    if (cart.status < 0) {
      await getCarts()
      this.setState({ loading: false })
      onBack()
    }
    else {
      this.setState({ loading: false })
    }
  }

  onRefresh = () => {
    const { getCartDetail, id, token, getCarts, onBack } = this.props
    this.setState({
      refreshing: true,
      loading: true
    }, async () => {
      await getCartDetail(id, token)
      const { cart } = this.props
      if (cart.status < 0 || cart.status === 4) {
        await getCarts()
        this.setState({
          refreshing: false,
          loading: false
        })
        onBack()
      }
      else {
        this.setState({
          refreshing: false,
          loading: false
        })
      }
    })
  }

  confirmCart = async (id) => {
    const { confirmCart, token, cart, getCarts, onBack } = this.props
    const { fees, shopNote } = this.state
    let totalAmounts = cart.shoppingCartAmounts.filter((amount) => amount.type === 1)
    const payments = cart.shoppingCartPayments
    const details = cart.shoppingCartDetails
    const invalidDetail = details
      .find(item => !item.productVariation || (item.productVariation && item.quantity > item.productVariation.quantity))

    Alert.alert(
      'Confirm',
      'Do you want to confirm cart?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: async () => {
            this.setState({ loading: true })
            // for (const fee of fees) {
            //   const amount = totalAmounts.find((a) => a.currencyUnitId === fee.currencyUnitId)
            //   if (amount) {
            //     const newValue = amount.value + fee.value
            //     const index = totalAmounts.indexOf(amount)
            //     const newAmount = { ...amount, value: newValue }
            //     totalAmounts.splice(index, 1, newAmount)
            //   }
            //   else {
            //     totalAmounts.push({
            //       value: fee.value,
            //       type: 1,
            //       currencyUnitId: fee.currencyUnitId,
            //       shoppingCartId: cart.id
            //     })
            //   }
            // }
            const data = {
              metaData: {
                // status: payments.length === 1 && payments[0].paymentType.renderType === PAYMENT_TYPE.COD
                //   ? CART_STATUS.READY_TO_CHECKOUT
                //   : CART_STATUS.WAITING_FOR_PAYMENT_PROOF,
                shopNote,
                status: CART_STATUS.READY_TO_CHECKOUT
              },
              fees,
              amounts: fees.length === 0 ? [] : totalAmounts
            }

            const errors = []
            if (invalidDetail) {
              errors.push('* Invalid quantity.')
            }
            if (errors.length > 0) {
              this.setState({ errors, loading: false })
            }
            else {
              confirmCart && token && await confirmCart(id, data, token)
              await getCarts()
              this.setState({ loading: false })
              onBack()
            }
          }
        }
      ],
      { cancelable: false }
    )
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
            const data = {
              metaData: {
                status: CART_STATUS.REJECT
              },
              fees: [],
              amounts: []
            }
            await deleteCart(id, token, data)
            await getCarts()
            this.setState({ loading: false })
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  addFee = ({ feeTitle, feeValue, feeUnit, feeDescription }) => {
    const { cart } = this.props
    const newFee = {
      title: feeTitle,
      value: parseFloat(feeValue),
      currencyUnitId: feeUnit,
      description: feeDescription
    }
    const fees = [...this.state.fees, newFee]
    const amount = cart && cart.shoppingCartAmounts && cart.shoppingCartAmounts.find(item => item.currencyUnitId === feeUnit && item.type === 1)
    if (amount) {
      amount.value += parseFloat(feeValue)
      const totalAmount = cart && cart.shoppingCartAmounts
        ? cart.shoppingCartAmounts
          .filter(item => item.type === 1)
          .map(item => `${item.value}${item.currencyUnit.code}`)
          .join(' + ')
        : 0
      cart.totalAmount = totalAmount
      this.setState({ fees })
    }
    else {
      return false
    }
  }

  // fee not in db
  removeFee = (index) => {
    const { cart } = this.props
    const fees = [...this.state.fees]
    const fee = fees[index]
    const amount = cart && cart.shoppingCartAmounts && cart.shoppingCartAmounts.find(item => item.currencyUnitId === fee.currencyUnitId && item.type === 1)
    if (amount) {
      amount.value -= parseFloat(fee.value)
      const totalAmount = cart && cart.shoppingCartAmounts
        ? cart.shoppingCartAmounts
          .filter(item => item.type === 1)
          .map(item => `${item.value}${item.currencyUnit.code}`)
          .join(' + ')
        : 0
      cart.totalAmount = totalAmount
      fees.splice(index, 1)
      this.setState({ fees })
    }
    else {
      return false
    }
  }

  onNoteChange = (note) => {
    this.setState({ shopNote: note })
  }

  renderStatus = (status) => {
    const icon = {
    }
    switch (status) {
      case 5:
      case 0:
        icon.name = 'shopping-basket'
        break
      case 1:
        icon.name = 'access-time'
        break
      case 2:
      case 4:
        icon.name = 'check-circle'
        icon.color = 'green'
        break
      case 3:
        icon.name = 'assignment-return'
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
        {status === CART_STATUS.TO_BE_CONFIRMED ? CART_STATUS_MAP[status] : 'Waiting for customer to checkout'}
      </FormLabel>
    ]
  }

  render() {
    const { onBack, currencyUnits, cart } = this.props
    const { fees, shopNote, errors, loading, refreshing } = this.state
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
              ref='scrollView'
              onContentSizeChange={(width, height) => errors.length > 0 && this.refs.scrollView.scrollTo({ y: height })}
            >
              <General
                id={cart.id}
                date={cart.updatedAt}
                status={cart.status}
                payments={cart.shoppingCartPayments}
                user={cart.user}
                logo={cart.user.images && cart.user.images.length > 0 && cart.user.images[0]}
                statusComponent={this.renderStatus(cart.status)}
                editable={false}
                onBack={onBack}
              />

              <Details
                details={cart.shoppingCartDetails}
                subTotalAmount={cart.subTotalAmount}
                totalItem={cart.totalItem}
                editable={false}
                onBack={onBack}
              />

              {((cart.cartAdditionalFees && cart.cartAdditionalFees.length > 0)
                || cart.status === CART_STATUS.TO_BE_CONFIRMED) &&
                <AdditionalFees
                  fees={cart.status === CART_STATUS.TO_BE_CONFIRMED ? fees : cart.cartAdditionalFees}
                  editable={cart.status === CART_STATUS.TO_BE_CONFIRMED}
                  units={currencyUnits}
                  addFee={this.addFee}
                  removeFee={this.removeFee}
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
                note={cart.status === CART_STATUS.TO_BE_CONFIRMED ? shopNote : (cart.shopNote || 'No note')}
                editable={cart.status === CART_STATUS.TO_BE_CONFIRMED}
                onNoteChange={this.onNoteChange}
              />

              <ErrorMessage errors={errors} />

              {/* <View style={{ marginTop: 7, marginBottom: 7, height: 80 }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#992320', width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                  onPress={() => this.confirmCart(cart.id)}>
                  <Text style={{ color: '#fff' }}>Confirm</Text>
                </TouchableOpacity>
              </View> */}
            </ScrollView>
            <SubMenu
              updateCart={cart.status === CART_STATUS.TO_BE_CONFIRMED ? () => this.confirmCart(cart.id) : null}
              deleteCart={() => this.deleteCart(cart.id)}
              id={cart.user.id}
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
      </DefaultPage>
    )
  }
}

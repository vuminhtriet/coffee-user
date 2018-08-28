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
import PaymentMethods from './PaymentMethods'
import UserNote from './UserNote'
import ShopNote from './ShopNote'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubMenu from '../containers/SubMenu';
import ErrorMessage from './ErrorMessage';
import {
  CART_STATUS,
  CART_STATUS_MAP
} from '../../../common/models';
import { round } from '../../../common/utils/format'

export default class UserCartDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      details: [],
      payments: [],
      amounts: [],
      totalAmount: '',
      shopShippingTypeId: null,
      buyerNote: '',
      errors: [],
      loading: true,
      refreshing: false
    }
  }

  async componentDidMount() {
    const { getCartDetail, id, token } = this.props
    id && token && await getCartDetail(id, token)
    const { cart } = this.props
    this.setState({
      details: cart.shoppingCartDetails,
      amounts: cart.amounts,
    }, () => this.setState({ loading: false }))
  }

  onRefresh = () => {
    const { getCartDetail, id, token } = this.props
    this.setState({
      refreshing: true,
      loading: true
    }, async () => {
      await getCartDetail(id, token)
      const { cart } = this.props
      this.setState({
        refreshing: false,
        details: cart.shoppingCartDetails,
        amounts: cart.amounts
      }, () => this.setState({ loading: false }))
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
            token && await deleteCart(id, token)
            await getCarts()
            this.setState({ loading: false })
            onBack()
          }
        }
      ],
      { cancelable: false }
    )
  }

  updateCart = async (id) => {
    const { addCart, token, onBack, getCarts, user } = this.props
    const { buyerNote, shopShippingTypeId, details, payments, amounts } = this.state
    const metaData = {
      buyerNote,
      shopShippingTypeId,
      status: 1
    }

    const subTotalAmounts = amounts
      .filter(item => item.value > 0)
      .map(item => {
        const { currencyUnit, ...amount } = item
        return { ...amount }
      })
    const totalAmounts = subTotalAmounts.map(item => {
      return { ...item, type: 1 }
    })
    const submitAmounts = subTotalAmounts.concat(totalAmounts)

    const submitDetails = details
      .map(item => {
        if (item.isValid) {
          item.cashValue = item.price.cashValue
          item.electricValue = item.price.electricValue
        }
        else {
          item.status = 0
        }
        const { isValid, price, promotionPrice, cashUnit, electricUnit, ...detail } = item
        return { ...detail }
      })

    const submitPayments = payments.map(item => {
      const amount = submitAmounts.find(elem => elem.type === 1 && elem.currencyUnitId === item.currencyUnitId)
      if (item.shopId) {
        const payment = {
          "value": amount.value,
          "status": 1,
          "userPaymentMethodId": null,
          "paymentTypeId": item.paymentTypeId,
          "currencyUnitId": item.currencyUnitId
        }
        return payment
      }
      else {
        const payment = {
          "value": amount.value,
          "status": 1,
          "userPaymentMethodId": item.id,
          "paymentTypeId": item.paymentTypeId,
          "currencyUnitId": item.currencyUnitId
        }
        return payment
      }
    })

    const data = {
      metaData,
      details: submitDetails,
      amounts: submitAmounts,
      payments: submitPayments,
      fees: []
    }
    console.log(data);

    const errors = []
    if (submitDetails.find(item => item.status === 0)) {
      errors.push('* Invalid details.')
    }
    if (payments && payments.length === 0) {
      errors.push('* Payment method required.')
    }
    if (payments && subTotalAmounts && payments.length !== subTotalAmounts.length) {
      errors.push('* Payment methods are residual or not enough.')
    }
    if (!metaData.shopShippingTypeId) {
      errors.push('* Delivery method required.')
    }
    if (user && user.addresses) {
      const address = user.addresses.find(item => item.isDefault)
      if (!address || !address.fullAddress) {
        errors.push(`* Buyer's address required.`)
      }
    }
    if (errors.length) {
      return this.setState({
        errors
      })
    }
    else {
      Alert.alert(
        'Confirm',
        'Some additional fees can be added by shop due to your selection. Please wait for the shop to confirm your order or chat with the shop to confirm it as soon as possible. Do you want to continue?',
        [
          { text: 'Cancel', onPress: () => { } },
          {
            text: 'OK', onPress: async () => {
              this.setState({ loading: true })
              addCart && token && await addCart(id, data, token)
              await getCarts()
              this.setState({ loading: false })
              onBack()
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  onQuantityChange = async (item, quantity) => {
    const { updateQuantity, token, cart, getCarts } = this.props
    this.setState({ loading: true })
    const amounts = [...this.state.amounts]
    const details = [...this.state.details]
    const cartId = cart.id
    const detailId = item.id

    const newAmounts = item.isValid
      ? amounts.map(elem => {
        const deltaQuantity = quantity - item.quantity
        if (elem.currencyUnitId === item.cashUnitId) {
          const cashValue = item.promotionPrice
            ? item.promotionPrice.cashValue * deltaQuantity
            : item.price.cashValue * deltaQuantity
          const newValue = round(elem.value + cashValue, 2)
          return { ...elem, value: newValue }
        }
        else if (elem.currencyUnitId === item.electricUnitId) {
          const electricValue = item.promotionPrice
            ? item.promotionPrice.electricValue * deltaQuantity
            : item.price.electricValue * deltaQuantity
          const newValue = round(elem.value + electricValue, 8)
          return { ...elem, value: newValue }
        }
        else {
          return { ...elem }
        }
      })
      : amounts

    const newDetails = details.map(elem => elem.id === item.id ? { ...elem, quantity } : { ...elem })

    const response = await updateQuantity(cartId, detailId, quantity, token)
    console.log(response);
    if (response) {
      this.setState({ amounts: newAmounts, details: newDetails, loading: false })
      getCarts()
    }
    else {
      this.setState({ loading: false })
    }
  }

  deleteProduct = async (item) => {
    const { deleteProduct, token, cart, getCarts } = this.props
    const { amounts, details } = this.state
    const cartId = cart.id
    const detailId = item.id
    const validDetails = details.filter(elem => elem.isValid)
    console.log(details);
    if (details.length === 1) {
      this.deleteCart(cartId)
    }
    else {
      this.setState({ loading: true })
      const newAmounts = item.isValid
        ? amounts.map(elem => {
          if (elem.currencyUnitId === item.cashUnitId) {
            const cashValue = item.promotionPrice
              ? item.promotionPrice.cashValue * item.quantity
              : item.price.cashValue * item.quantity
            const newValue = elem.value - cashValue
            return { ...elem, value: newValue }
          }
          else if (elem.currencyUnitId === item.electricUnitId) {
            const electricValue = item.promotionPrice
              ? item.promotionPrice.electricValue * item.quantity
              : item.price.electricValue * item.quantity
            const newValue = elem.value - electricValue
            return { ...elem, value: newValue }
          }
          else {
            return { ...elem }
          }
        })
        : amounts
      const newDetails = details.filter(elem => elem.id !== item.id)

      const response = await deleteProduct(cartId, detailId, token)
      if (response) {
        this.setState({ amounts: newAmounts, details: newDetails, loading: false })
        getCarts()
      }
      else {
        this.setState({ loading: false })
      }
    }
  }

  selectShopShippingType = async (shopShippingTypeId) => {
    this.setState({ shopShippingTypeId })
  }

  selectUserPaymentMethod = async (userPayment, currencyUnitId) => {
    const payments = [...this.state.payments]
    const existedPayment = payments.find(item => item.currencyUnitId === currencyUnitId)
    const newPayments = existedPayment
      ? [...payments.filter(item => item.id !== existedPayment.id), { ...userPayment, currencyUnitId }]
      : [...payments, { ...userPayment, currencyUnitId }]
    this.setState({ payments: newPayments })
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
        {CART_STATUS_MAP[status]}
      </FormLabel>
    ]
  }

  render() {
    const { onBack, units, cart, user } = this.props
    const {
      details,
      payments,
      shopShippingTypeId,
      buyerNote,
      errors,
      amounts,
      loading,
      refreshing
    } = this.state
    const totalAmount = amounts.length > 0
      ? amounts
        .map(item => `${item.value}${item.currencyUnit ? item.currencyUnit.code : ''}`)
        .join(' + ')
      : ''
    const totalItem = details.length > 0
      ? details
        .filter(item => item.isValid)
        .reduce((result, item) => result + item.quantity, 0)
      : 0
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
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
                payments={[]}
                shop={cart.shop}
                logo={cart.shop.images.find(item => item.type === 1)}
                statusComponent={this.renderStatus(cart.status)}
                onImageUpload={this.onImageUpload}
                editable={false}
                onBack={onBack}
              />

              <Details
                details={cart.shoppingCartDetails}
                subTotalAmount={totalAmount}
                totalItem={totalItem}
                editable={true}
                units={units}
                editDetails={details}
                onQuantityChange={this.onQuantityChange}
                deleteProduct={this.deleteProduct}
                onBack={onBack}
              />

              {/* <AdditionalFees
                fees={cart.cartAdditionalFees}
                editable={false}
                units={units}
              /> */}

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
                  {totalAmount}
                </Text>
              </View>

              <PaymentMethods
                payments={payments}
                editable={true}
                amounts={amounts}
                userPayments={cart.user.userPaymentMethods}
                shopPayments={cart.shop.shopPaymentMethods}
                selectUserPayment={this.selectUserPaymentMethod}
              />

              <Delivery
                delivery={shopShippingTypeId}
                shopId={cart.shop.id}
                editable={true}
                selectShopShippingType={this.selectShopShippingType}
                shopShippingTypes={cart.shop.shopShippingTypes}
              />

              <ShippingInfo
                user={user}
                address={user && user.addresses && user.addresses.find(item => item.isDefault)}
                editable={false}
              />

              <UserNote
                note={buyerNote}
                editable={true}
                onNoteChange={this.onNoteChange}
              />

              {/* <ShopNote
                note={cart.shopNote || 'No note'}
                editable={false}
                onNoteChange={this.onNoteChange}
              /> */}

              <ErrorMessage errors={errors} />

              {/* <View style={{ marginTop: 7, marginBottom: 7, height: 80 }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#992320', width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                  onPress={() => this.updateCart(cart.id)}>
                  <Text style={{ color: '#fff' }}>Proceed to checkout</Text>
                </TouchableOpacity>
              </View> */}
            </ScrollView>
            <SubMenu
              updateCart={() => this.updateCart(cart.id)}
              deleteCart={() => this.deleteCart(cart.id)}
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
      </DefaultPage>
    )
  }
}

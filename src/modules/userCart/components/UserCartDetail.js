import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native'
import {
  Icon,
  FormLabel,
  FormValidationMessage
} from 'react-native-elements'
import Details from './Details'
import General from './General'
import Delivery from './Delivery'
import AdditionalFees from './AdditionalFees'
import PaymentMethods from './PaymentMethods'
import ShippingInfo from './ShippingInfo'
import UserNote from './UserNote'
import ShopNote from './ShopNote'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import {
  CART_STATUS,
  CART_STATUS_MAP
} from '../../../common/models';
const { width, height } = Dimensions.get('window');

export default class UserCartDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: [],
      loading: true,
      userPaymentMethods: []
    }
  }

  async componentDidMount() {
    const { getUserPaymentMethods, user, token } = this.props
    user && token && getUserPaymentMethods && await getUserPaymentMethods(user.id, token)
    const { userPaymentMethods } = this.props
    this.setState({ userPaymentMethods, loading: false })
  }

  deleteCart = () => {
    const { deleteCart, id, token } = this.props
    deleteCart(id, token)
  }

  addCart = async () => {
    this.setState({ loading: true })
    const { addCart, token, cart, carts, onBack, getCheckedOutCarts, paymentTypes } = this.props
    const { userPaymentMethods } = this.state
    const submitCart = carts.find(item => item.metaData.shopId === cart.metaData.shopId)

    const { totalQuantity, status, ...metaData } = submitCart.metaData

    const subTotalAmounts = submitCart.amounts.filter(item => item.value !== 0)
    const totalAmounts = [...subTotalAmounts].map((item, index) => {
      return { ...item, type: 1 }
    })
    const amounts = subTotalAmounts.concat(totalAmounts)

    // const payments = submitCart.payments
    //   .filter(item => item.isSelect === true && parseFloat(item.value) > 0)
    //   .map((elem, index) => {
    //     const { item, isSelect, ...newItem } = elem
    //     return { ...newItem }
    //   })

    const details = submitCart.details.map((elem, index) => {
      const { productPriceId, item, ...newItem } = elem
      return newItem
    })

    const payments = userPaymentMethods
      .filter(item => item.isSelect === true)
      .map((item, index) => {
        const paymentType = paymentTypes.find(elem => elem.id === item.paymentTypeId)
        const currencyUnits = paymentType
          ? paymentType.currencyUnits.map(elem => elem.id)
          : []
        const amount = submitCart.amounts.find(elem => elem.value !== 0 && currencyUnits.includes(elem.currencyUnitId))
        const obj = {
          value: amount ? amount.value : 0,
          status: 1,
          userPaymentMethodId: item.id,
          paymentTypeId: item.paymentTypeId,
          currencyUnitId: amount ? amount.currencyUnitId : 0
        }
        return obj
      })
      .filter(item => item.value !== 0)

    const data = {
      metaData,
      details,
      amounts,
      payments
    }
    
    const errors = []
    if (payments.length === 0) {
      errors.push('* Payment method required.')
    }
    if (payments.length !== subTotalAmounts.length) {
      errors.push('* Payment methods are residual or not enough.')
    }
    if (!metaData.shopShippingTypeId) {
      errors.push('* Delivery method required.')
    }
    if (errors.length) {
      return this.setState({
        errors,
        loading: false
      })
    }
    else {
      addCart && await addCart(carts, data, token)
      await getCheckedOutCarts()
      this.setState({ loading: false })
      onBack()
    }
  }

  onNoteChange = (note) => {
  }

  onSelectShippingType = (shopShippingTypeId) => {
    const {
      carts,
      cart,

      onSelectShippingType
    } = this.props

    onSelectShippingType({
      carts,
      cart,
      shopShippingTypeId
    })
  }

  changeUserNote = (note) => {
    const {
      carts,
      cart,

      onChangeUserNote
    } = this.props

    onChangeUserNote({
      carts,
      cart,
      note
    })
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

  changeProductQuantity = (detail, index, quantity) => {
    const {
      onChangeProductQuantity,
      carts,
      cart,
      totalItem
    } = this.props

    if (quantity >= 1) {
      onChangeProductQuantity && onChangeProductQuantity({ carts, cart, detail, index, quantity, totalItem })
    }
  }

  // selectPaymentMethod = (payment, index) => {
  //   const {
  //     onSelectePaymentMethod,
  //     carts,
  //     cart
  //   } = this.props

  //   onSelectePaymentMethod({ payment, index, cart, carts })
  // }

  selectPaymentMethod = (payment) => {
    const { userPaymentMethods } = this.state
    const payments = userPaymentMethods.map((item, index) => {
      return item.id === payment.id ? { ...item, isSelect: !payment.isSelect } : { ...item }
    })
    this.setState({ userPaymentMethods: payments })
  }

  render() {
    const {
      onBack,
      currencyUnits,
      userPayments,
      paymentTypes,
      user,
      cart: { shop, metaData, details, amounts, cartAdditionalFees, payments },

      onNoteChange,
      onSelectShippingType
    } = this.props
    const { errors, userPaymentMethods, loading } = this.state

    return (
      <DefaultPage style={{ flexDirection: 'row' }}>
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle
            title='Cart detail'
            onBack={onBack} />
        </View>
        {!loading
          ? <View style={{ flex: 1 }}>
            <ScrollView>

              <General
                shop={shop}
              />

              <Details
                editable={metaData.status === CART_STATUS.SHOPPING}
                details={details}
                amounts={amounts}
                totalQuantity={metaData.totalQuantity}
                changeProductQuantity={this.changeProductQuantity}
                currencyUnits={currencyUnits}
              />

              {/*<AdditionalFees
              fees={cartAdditionalFees}
              editable={false}
              units={currencyUnits}
              />*/}

              {/* <PaymentMethods
              editable={metaData.status === 0 || metaData.status === 5}
              title={(metaData.status === 0 || metaData.status === 5)
                ? 'Select Payment methods'
                : 'Payment methods'
              }
              userPayments={userPayments}
              paymentTypes={paymentTypes}
              payments={payments.sort((payment1, payment2) => payment1.paymentTypeId > payment2.paymentTypeId)}
              selectePaymentMethod={this.selectPaymentMethod}
              /> */}

              <PaymentMethods
                editable={true}
                title={'Select payment methods'}
                paymentTypes={paymentTypes}
                payments={userPaymentMethods.sort((a, b) => a.paymentTypeId > b.paymentTypeId)}
                selectPaymentMethod={this.selectPaymentMethod}
              />

              <Delivery
                shopShippingTypes={shop.shopShippingTypes}
                shopId={shop.id}
                delivery={metaData.shopShippingTypeId}
                editable={metaData.status === CART_STATUS.SHOPPING}
                selectItem={(id) => this.onSelectShippingType(id)}
              />

              <ShippingInfo
                user={user}
                editable={metaData.status === CART_STATUS.SHOPPING}
              />

              <UserNote
                note={metaData.buyerNote || 'No note'}
                editable={metaData.status === CART_STATUS.SHOPPING}
                onNoteChange={this.changeUserNote}
              />

              <ShopNote
                note={metaData.shopNote || 'No note'}
                editable={false}
              />

              <FormValidationMessage>
                {errors.length > 0 && errors.map(item => {
                  return `${item}\n`
                })}
              </FormValidationMessage>

              {metaData.status === CART_STATUS.SHOPPING &&
                <View style={{ marginTop: 7, marginBottom: 7, height: 80 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#992320', width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center', borderLeftColor: '#000' }}
                    onPress={this.addCart}>
                    <Text style={{ color: '#fff' }}>Checkout</Text>
                  </TouchableOpacity>
                </View>
              }

            </ScrollView>
          </View>
          : <View style={{
            justifyContent: 'center',
            padding: 10,
            alignItems: 'center',
            alignContent: 'center',
            height: '100%',
            flex: 1
          }}>
            <ActivityIndicator size="large" color="#6F4E37" />
          </View>
        }
      </DefaultPage>
    )
  }
}

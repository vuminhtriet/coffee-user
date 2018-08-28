import axios from 'axios'
import { connect } from 'react-redux'
import { addPayments } from '../actions'
import { BASE_URL } from '../../../common/models'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME as SHOP_MODULE } from '../models'
import { MODULE_NAME as USER_MODULE } from '../../user/models'
import PaymentMethod from '../components/PaymentMethod'

const mapDispatchToProps = (dispatch, props) => ({
  addShopPayment: async (token, shop, user, values) => {
    try {
      const url = `${BASE_URL}/api/users/${user.id}/userPaymentMethods`
      const result = await loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          headers: {
            Authorization: token
          },
          data: {
            accountName: values.accountName || '',
            accountNumber: values.accountNumber || '',
            // swiffCode: '',
            bankName: values.bankName || '',
            branchName: values.branchName || '',
            // QRCodeImage: '',
            paymentAddress: values.paymentAddress || '',
            // note: '',
            status: 'active',
            shopId: shop.id,
            userId: null,
            paymentTypeId: values.paymentTypeId
          }
        }, dispatch)
        if (response && response.data) {
          return dispatch(addPayments({
            ...response.data
          }))
        }
        return false
      })
      return result
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  paymentTypes: state.common.paymentTypes,
  token: state[USER_MODULE].token,
  user: state[USER_MODULE].user,
  shop: state[SHOP_MODULE].shop,
  shopPayments: state[SHOP_MODULE].shopPayments
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod)

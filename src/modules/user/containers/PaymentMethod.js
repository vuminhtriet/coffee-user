import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { addUserPayments } from '../actions'
import { BASE_URL } from '../../../common/models'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME as SHOP_MODULE } from '../../shop/models'
import { MODULE_NAME as USER_MODULE } from '../models'
import { MODULE_NAME as MODULE_ORDER } from '../../order/models'
import PaymentMethod from '../components/PaymentMethod'

const mapDispatchToProps = (dispatch, props) => ({
  addUserPayment: async (token, user, values) => {
    try {
      const url = `${BASE_URL}/api/users/${user.id}/userPaymentMethods`
      return loading(dispatch, async () => {
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
            shopId: null,
            userId: user.id,
            paymentTypeId: values.paymentTypeId
          }
        }, dispatch)
        if (response && response.data) {
          return dispatch(addUserPayments({
            ...response.data
          }))
        }
        return false
      })
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  paymentTypes: state.common.paymentTypes,
  token: state[USER_MODULE].token,
  user: state[USER_MODULE].user,
  userPayments: state[USER_MODULE].user
    ? state[USER_MODULE].user.userPaymentMethods : []
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod)

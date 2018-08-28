import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME } from '../models'
import UserPaymentMethod from '../components/UserPaymentMethod'
import { mapDispatchToProps as userSettingHandlers } from './UserSetting'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  ...userSettingHandlers(dispatch, props),
  deleteUserPaymentMethod: async (token, user, payment) => {
    try {
      const url = `${BASE_URL}/api/users/${user.id}/userPaymentMethods/${payment.id}`
      const result = await loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PUT',
          headers: {
            Authorization: token
          },
          data: {
            status: 'inactive'
          }
        }, dispatch)
        if (response && response.data) {
          return response.data
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
  userPayments: state[MODULE_NAME].user
    ? state[MODULE_NAME].user.userPaymentMethods : [],
  paymentTypes: state.common.paymentTypes,
  token: state[MODULE_NAME].token,
  user: state[MODULE_NAME].user
})

export default connect(mapStateToProps, mapDispatchToProps)(UserPaymentMethod)

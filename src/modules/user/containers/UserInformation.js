import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setUserInfomation } from '../actions'
import { MODULE_NAME } from '../models'
import UserInformation from '../components/UserInformation'

export const mapDispatchToProps = (dispatch, props) => ({
  update: (token, user, addressId) => {
    try {
      const url = `${BASE_URL}/api/users/${user.id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PATCH',
          headers: {
            Authorization: token
          },
          data: {
            displayName: user.displayName,
            gender: user.gender,
            birthdate: moment(user.birthdate).format()
          }
        }, dispatch)
        // TODO: fetch register
        if (response && response.data) {
          const addresses = await fetch({
            url: `${BASE_URL}/api/users/${user.id}/addresses/${addressId}`,
            method: 'PUT',
            headers: {
              Authorization: token
            },
            data: {
              countryId: user.nationality,
              fullAddress: user.address
            }
          }, dispatch)
          dispatch(setUserInfomation({
            ...response.data,
            addresses: [{
              ...addresses.data
            }]
          }))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
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
        })
        if (response && response.data) {
          return response.data
        }
        return false
      }, dispatch)
      return result
    } catch (error) {
      return false
    }
  },
  getUserInformation: (token, id) => {
    try {
      const filter = {
        include: [
          { 'addresses': 'country' },
          'shoppingCarts',
          {
            'relation': 'userPaymentMethods',
            'scope': {
              'where': {
                'shopId': null,
                'status': 'active'
              }
            }
          },
          'shop'
        ]
      }
      const url = `${BASE_URL}/api/users/${id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          },
          params: {
            filter: JSON.stringify(filter)
          }
        }, dispatch)
        // TODO: fetch register
        if (response && response.data) {
          dispatch(setUserInfomation({
            ...response.data
          }))
          return response.data
        }
        return false
      })
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  countries: state.common.countries,
  user: state[MODULE_NAME].user,
  token: state[MODULE_NAME].token,
  userPayments: state[MODULE_NAME].user
    ? state[MODULE_NAME].user.userPaymentMethods : [],
  paymentTypes: state.common.paymentTypes
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInformation)

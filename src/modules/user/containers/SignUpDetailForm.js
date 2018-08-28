import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setUserInfomation, setUserToken, setCountries } from '../actions'
import SignUpDetailForm from '../components/SignUpDetailForm'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  signup: (user, token) => {
    try {
      const url = `${BASE_URL}/api/users/${token.userId}`
      return loading(dispatch, async () => {
        const response = await axios({
          url: `${BASE_URL}/api/shops/add-shop`,
          method: 'POST',
          headers: {
            Authorization: token.token
          },
          data: {
            metaData: {
              name: `${user.displayName}'s shop`,
              email: `${user.email}`,
              slogan: '',
              description: '',
              website: '',
              facebookUrl: '',
              status: 1,
              userId: token.userId,
              registeredDate: moment().format()
            },
            addresses: [{
              title: '',
              contactName: '',
              regionCodePhone: '',
              phoneNumber: '',
              fullAddress: '',
              companyName: '',
              lat: 0,
              lng: 0,
              isDefault: true,
              cityId: null,
              countryId: null
            }],
            shopShippingTypes: [],
            paymentMethods: []
          }
        })
        // TODO: fetch register
        if (response && response.data) {
          await axios({
            url: `${BASE_URL}/api/users/${token.userId}/addresses`,
            method: 'POST',
            headers: {
              Authorization: token.token
            },
            data: {
              title: '',
              contactName: '',
              regionCodePhone: '',
              phoneNumber: '',
              fullAddress: '',
              companyName: '',
              lat: 0,
              lng: 0,
              isDefault: true,
              cityId: null,
              countryId: user.nationality || null,
              userId: 0
            }
          })
          await axios({
            url,
            method: 'PATCH',
            headers: {
              Authorization: token.token
            },
            data: {
              status: 1,
              displayName: user.displayName,
              gender: user.gender,
              nationality: user.nationality || null,
              birthdate: moment(user.birthday).format()
            }
          })
          const filter = {
            include: [
              'addresses',
              'shoppingCarts',
              {
                'relation': 'userPaymentMethods',
                'scope': {
                  'where': {
                    'shopId': null
                  }
                }
              },
              'shop'
            ]
          }
          const infomation = await axios({
            url: `${BASE_URL}/api/users/${token.userId}`,
            headers: {
              Authorization: token.id
            },
            params: {
              filter: JSON.stringify(filter)
            }
          })
          // TODO: fetch register
          dispatch(setUserInfomation({
            ...infomation.data
          }))
          dispatch(setUserToken(token.id))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  createPassword: (password, token) => {
    try {
      const url = `${BASE_URL}/api/users/reset-password`
      return loading(dispatch, async () => {
        // const hashedPassword = sha256(password).toString()
        let response = await axios({
          url,
          method: 'POST',
          data: {
            newPassword: password
          },
          headers: {
            Authorization: token.token
          }
        })
        if (!response) {
          return false
        }
        return true
      })
    } catch (error) {
      return false
    }
  },
  verifyPassword: async (email, password) => {
    try {
      const url = `${BASE_URL}/api/users/validate-password`
      const response = await axios({
        url,
        method: 'POST',
        data: {
          email,
          password
        }
      })
      if (response && response.data && response.data.id) {
        return {
          ...response.data,
          token: response.data.id
        }
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  countries: state.common.countries
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpDetailForm)

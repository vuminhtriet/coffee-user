import axios from 'axios'
import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { setUserToken, setUserInfomation } from '../actions'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  login: async (email, password) => {
    // TODO: Get user information here
    try {
      const result = await loading(dispatch, async () => {
        const response = await axios({
          url: `${BASE_URL}/api/users/login`,
          method: 'POST',
          data: {
            email,
            password
          }
        })
        if (!response && !response.data && !response.data.id) {
          return false
        }
        const { id, userId } = response.data
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
            // 'images'
          ]
        }
        const response_ = await axios({
          url: `${BASE_URL}/api/users/${userId}?filter=${JSON.stringify(filter)}`
        })
        if (response_ && response_.data) {
          dispatch(setUserInfomation(response_.data))
          dispatch(setUserToken(id))
          // response_.data.images.length > 0 && dispatch(setUserImage(response_.data.images[0]))
          return true
        }
        return false
      })
      return result
    } catch (error) {
      return false
    }
  },
  forgetPassword: async (email) => {
    try {
      const result = await loading(dispatch, async () => {
        const result = await axios({
          url: `${BASE_URL}/api/users/reset`,
          method: 'POST',
          data: {
            email
          }
        })
        return true
      })
      return result
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)

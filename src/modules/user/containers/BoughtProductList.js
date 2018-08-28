import axios from 'axios'
import { connect } from 'react-redux'
import BoughtProductList from '../components/BoughtProductList'
import { MODULE_NAME } from '../models'
import { setUserPayment, setBoughtProduct } from '../actions'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  getProducts: async (user) => {
    try {
      return loading(dispatch, async () => {
        let response = await axios({
          url: `${BASE_URL}/api/users/${user.id}/bought-product`
        })
        if (response && response.data) {
          dispatch(setBoughtProduct(response.data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  submit: async (token, user, productsId, { rating, text }) => {
    try {
      return loading(dispatch, async () => {
        let response = await fetch({
          url: `${BASE_URL}/api/users/${user.id}/productRatings`,
          method: 'POST',
          headers: {
            Authorization: token
          },
          data: {
            value: rating,
            comment: text,
            isVerified: true,
            productId: productsId,
            userId: user.id
          }
        }, dispatch)
        if (response && response.data) {
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  token: state[MODULE_NAME].token,
  user: state[MODULE_NAME].user,
  products: state[MODULE_NAME].boughtProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(BoughtProductList)

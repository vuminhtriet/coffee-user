import axios from 'axios'
import { connect } from 'react-redux'
import WriteReview from '../components/WriteReview'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { getProductRating } from '../actions'
import { loading, fetch } from '../../../common/effects'

const mapDispatchToProps = (dispatch, props) => ({
  writeReview: async (data, token) => {
    try {
      const url = `${BASE_URL}/api/products/${data.productId}/productRatings`
      const response = await fetch({
        url,
        method: 'POST',
        headers: {
          Authorization: token
        },
        data
      }, dispatch)
      if (response && response.data) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  productRating: (() => {
    const productRatings = state[MODULE_NAME].productRatings
    const user = state[MODULE_USER].user
    if (user && user.id) {
      const productRating = productRatings.find(item => item.userId === user.id)
      return productRating
    } else {
      return null
    }
  })(),
  token: state[MODULE_USER].token,
  userId: state[MODULE_USER].user ? state[MODULE_USER].user.id : null
})

export default connect(mapStateToProps, mapDispatchToProps)(WriteReview)

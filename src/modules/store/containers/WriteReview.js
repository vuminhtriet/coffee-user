import axios from 'axios'
import { connect } from 'react-redux'
import WriteReview from '../components/WriteReview'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as SHOP_MODULE } from '../../shop/models'
import { loading, fetch } from '../../../common/effects'
import { mapDispatchToProps as StoreHeaderHandlers } from '../../store/containers/StoreHeader'

const mapDispatchToProps = (dispatch, props) => ({
  writeReview: async (data, token) => {
    try {
      const url = `${TEST_URL}/api/reviewshops`
      const response = await fetch({
        url,
        method: 'POST',
        // headers: {
        //   Authorization: token
        // },
        data
      }, dispatch)
      if (response && response.data) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  },
  editReview: async (data, token, id) => {
    try {
      const url = `${TEST_URL}/api/reviewshops/${id}`
      const response = await fetch({
        url,
        method: 'PATCH',
        // headers: {
        //   Authorization: token
        // },
        data
      }, dispatch)
      if (response && response.data) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  },
  ...StoreHeaderHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  token: state[MODULE_USER].token,
  userId: state[MODULE_USER].user ? state[MODULE_USER].user.id : null,
  shop: state[SHOP_MODULE].shop
})

export default connect(mapStateToProps, mapDispatchToProps)(WriteReview)

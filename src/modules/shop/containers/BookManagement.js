import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { setShopOrders } from '../actions'
import BookManagement from '../components/BookManagement'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
  getOrders: (id, token) => {
    try {
      const filter = {
        where: {
          'shopId': id
        }
      }
      const url = `${TEST_URL}/api/orders?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
        //   headers: {
        //     Authorization: token
        //   }
        }, dispatch)
        if (response && response.data) {
          dispatch(setShopOrders(response.data))
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
  token: state[MODULE_USER].token,
  orders: state[MODULE_SHOP].orders,
  id: state[MODULE_SHOP].shop.id
})

export default connect(mapStateToProps, mapDispatchToProps)(BookManagement)

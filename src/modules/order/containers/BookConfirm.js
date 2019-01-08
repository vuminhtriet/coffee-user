import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import BookConfirm from '../components/BookConfirm'
import { MODULE_NAME as USER_MODULE } from '../../user/models'
import { setOrder, setShopDetail } from '../actions'

export const mapDispatchToProps = (dispatch, props) => ({
  getShopDetail: async (shopId, memberId) => {
    try {
        const filter = {
            "where": {
              "shopId": shopId,
              "memberId": memberId
            },
            "include":{
                "relation":"shop"
               }
          }
      const url = `${TEST_URL}/api/orders?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url
          // headers: {
          //   Authorization: token
          // }
        }, dispatch)
        console.log(response)
        // TODO: fetch register
        if (response && response.data) {
          console.log(response.data)
          dispatch(setOrder(response.data[0]))
          dispatch(setShopDetail(response.data[0].shop))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  deleteOrder: (id) => {
    try {
      const url = `${TEST_URL}/api/orders/${id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'DELETE'
          // headers: {
          //   Authorization: token
          // }
        }, dispatch)
        // TODO: fetch register
        if (response && response.data) {
          
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  updateOrder: (id, status, token) => {
    try {
      const url = `${TEST_URL}/api/orders/${id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PATCH',
          data: {
            status: status
          }
          // headers: {
          //   Authorization: token
          // }
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
  user: state[USER_MODULE].user,
  token: state[USER_MODULE].token,
  shop: state[MODULE_NAME].shop,
  order: state[MODULE_NAME].order
})

export default connect(mapStateToProps, mapDispatchToProps)(BookConfirm)

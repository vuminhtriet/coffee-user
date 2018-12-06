import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import BookDetail from '../components/BookDetail'
import { setOrderDetail } from '../actions'

export const mapDispatchToProps = (dispatch, props) => ({
    getOrderDetail: async (id, token) => {
    try {
        const filter = {
            "include": "shop"
          }
      const url = `${TEST_URL}/api/orders/${id}?filter=${JSON.stringify(filter)}`
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
          dispatch(setOrderDetail(response.data))
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
  }
})

const mapStateToProps = state => ({
  user: state[MODULE_NAME].user,
  token: state[MODULE_NAME].token,
  order: state[MODULE_NAME].order
})

export default connect(mapStateToProps, mapDispatchToProps)(BookDetail)

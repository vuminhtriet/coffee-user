import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { setOrderDetail, updateOrder, deleteProof } from '../actions'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import BookDetail from '../components/BookDetail'
import { ORDER_STATUS } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  getOrderDetail: (id, token) => {
    try {
      const filter = {
        "include": "member"
      }
      const url = `${TEST_URL}/api/orders/${id}?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url
          // headers: {
          //   Authorization: token
          // }
        }, dispatch)
        if (response && response.data) {
          dispatch(setOrderDetail(response.data))
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  // deleteOrder: (id, token, data) => {
  //   try {
  //     const url = `${BASE_URL}/api/shoppingCarts/${id}/delete-order`
  //     return loading(dispatch, async () => {
  //       const response = await fetch({
  //         url,
  //         method: 'POST',
  //         headers: {
  //           Authorization: token
  //         },
  //         data
  //       }, dispatch)
  //       if (response && response.data) {
  //         dispatch(updateOrder({ ...data }))
  //         return true
  //       }
  //       return false
  //     })
  //   } catch (error) {
  //     return false
  //   }
  // },
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
  },
  // completeOrder: (id, data, token) => {
  //   try {
  //     const url = `${BASE_URL}/api/shoppingCarts/${id}/complete-order`
  //     return loading(dispatch, async () => {
  //       const response = await fetch({
  //         url,
  //         method: 'POST',
  //         data: data,
  //         headers: {
  //           Authorization: token
  //         }
  //       }, dispatch)
  //       if (response && response.data) {
  //         dispatch(updateOrder(data))
  //         return true
  //       }
  //       return false
  //     })
  //   } catch (error) {
  //     return false
  //   }
  // },
  // deleteProof: (id, shoppingCartPaymentId) => {
  //   return dispatch(deleteProof({ id, shoppingCartPaymentId }))
  // }
})

const mapStateToProps = state => ({
  token: state[MODULE_USER].token,
  order: state[MODULE_SHOP].order
})

export default connect(mapStateToProps, mapDispatchToProps)(BookDetail)

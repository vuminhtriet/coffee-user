import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import BookDetail from '../components/BookDetail'
import { MODULE_NAME as USER_MODULE } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  bookTable: (token, information, contact) => {
    try {
      const url = `${TEST_URL}/api/orders`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          // headers: {
          //   Authorization: token
          // },
          data: {
            customerName: contact.displayName,
            orderTime: moment(information.dateTime).format(),
            customerAmount: information.amount,
            customerEmail: contact.email,
            customerPhone: contact.phone,
            shopId: information.shopId,
            memberId: information.id,
            orderCode: Math.random().toString(36).substring(7),
            status: 0
          }
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
  user: state[USER_MODULE].user,
  token: state[USER_MODULE].token
})

export default connect(mapStateToProps, mapDispatchToProps)(BookDetail)

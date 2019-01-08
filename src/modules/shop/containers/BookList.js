import axios from 'axios'
import { connect } from 'react-redux'
import BookList from '../components/BookList'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { MODULE_NAME as MODULE_SHOP } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
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
    token: state[MODULE_USER].token,
    order: state[MODULE_SHOP].order
})

export default connect(mapStateToProps, mapDispatchToProps)(BookList)

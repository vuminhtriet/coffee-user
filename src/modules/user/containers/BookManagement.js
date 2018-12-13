import axios from 'axios'
import { connect } from 'react-redux'
import BookManagement from '../../user/components/BookManagement'
import { MODULE_NAME } from '../models'
import { setUserOrders } from '../actions'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  getOrders: async (id, token, chosenOption, chosenStatus) => {
    try {
      let filter = {
        include: 'shop',
        where: {
          memberId: id
        },
        order: chosenOption
      }

      if(chosenStatus === 0 || chosenStatus === 1 || chosenStatus === 2 || chosenStatus === 3){
        filter.where["status"] = chosenStatus
      }

      const url = `${TEST_URL}/api/orders?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url
          // headers: {
          //   Authorization: token
          // }
        }, dispatch)
        if (response && response.data) {
          dispatch(setUserOrders(response.data))
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
  orders: state[MODULE_NAME].userOrders,
  token: state[MODULE_NAME].token,
  user: state[MODULE_NAME].user,
  id: state[MODULE_NAME].user.id
})

export default connect(mapStateToProps, mapDispatchToProps)(BookManagement)

import axios from 'axios'
import { connect } from 'react-redux'
import VisitedShops from '../components/VisitedShops'
import { MODULE_NAME } from '../models'
import { getVisitedShops } from '../actions'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'


const mapDispatchToProps = (dispatch, props) => ({
    getVisitedShops: async (user, sort = "clicked DESC") => {
    try {
      var filter = {
        "include": "shop",
        "where":{
           "memberId": user.id
        },
        "limit": 6,
        "order":sort
      }
      
      const url = `${TEST_URL}/api/clickshops?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        dispatch(getVisitedShops([...response.data]))
        return true
      }
    } catch (e) {
      console.log(e);
      return false
    }
  }
})

const mapStateToProps = state => ({
  shops: state[MODULE_NAME].visitedShops.slice(0, 6),
  user: state[MODULE_USER].user,
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(VisitedShops)

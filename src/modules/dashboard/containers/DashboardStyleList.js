import { connect } from 'react-redux'
import axios from 'axios'
import { TEST_URL } from '../../../common/models'
import DashboardStyleList from '../components/DashboardStyleList'
import { MODULE_NAME } from '../models'
import { getStyles } from '../actions'

const filter = {
  "include":{
    "relation":"shops",
    "scope":{
      "fields":"shopName"
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  getStyles: async () => {
    try {
      const url = `${TEST_URL}/api/styles?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        dispatch(getStyles([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  // styles: state[MODULE_NAME].styles.filter(item => item.shops.length > 0).slice(0, 6)
  styles: state[MODULE_NAME].styles.slice(0, 6)
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardStyleList)

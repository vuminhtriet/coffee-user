import { connect } from 'react-redux'
import axios from 'axios'
import PageStyles from '../components/PageStyles'
import { MODULE_NAME } from '../models'
import { TEST_URL } from '../../../common/models'
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
  styles: state[MODULE_NAME].styles
})

export default connect(mapStateToProps, mapDispatchToProps)(PageStyles)

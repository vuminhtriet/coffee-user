import { connect } from 'react-redux'
import axios from 'axios'
import PageBrands from '../components/PageBrands'
import { MODULE_NAME } from '../models'
import { TEST_URL } from '../../../common/models'
import { getBrands } from '../actions'

const filter = {
  "include":{
    "relation":"shops",
    "scope":{
      "fields":"shopName"
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  getBrands: async () => {
    try {
      const url = `${TEST_URL}/api/brands?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        dispatch(getBrands([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
    brands: state[MODULE_NAME].brands
})

export default connect(mapStateToProps, mapDispatchToProps)(PageBrands)

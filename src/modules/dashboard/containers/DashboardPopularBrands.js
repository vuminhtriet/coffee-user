import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../../dashboard/models'
// import { MODULE_NAME } from ''
import DashboardPopularBrands from '../components/DashboardPopularBrands'
import { BASE_URL } from '../../../common/models'
import { TEST_URL, GOOGLE_URL, API_KEY } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getBrands } from '../actions'
import {
  setUserLocation,
  setUserLatLng
} from '../../../common/actions/common'

const filter = {
  "include":{
    "relation":"shops",
    "scope":{
      "fields":"shopName"
    }
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  getDashboardPopularBrands: async (token) => {
    try {
      const url = `${TEST_URL}/api/brands?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
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
  brands: state[MODULE_NAME].brands.slice(0, 6)
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPopularBrands)

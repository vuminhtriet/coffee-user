import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../../dashboard/models'
import DashboardNearbyShops from '../components/DashboardNearbyShops'
import { TEST_URL, GOOGLE_URL, API_KEY } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getDashboardNearbyShops } from '../actions'
import {
  setUserLocation,
  setUserLatLng
} from '../../../common/actions/common'

const mapDispatchToProps = (dispatch, props) => ({
    getDashboardNearbyShops: async (lat,lng) => {
    try {
        const filter = {
        "where":{
            "shopLocation":{
                "near":[
                    lat,
                    lng
                ],
                "maxDistance":100,
                "unit":"kilometers"
            }
        }
        }
      const url = `${TEST_URL}/api/shops?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        dispatch(getDashboardNearbyShops([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  shops: state[MODULE_NAME].dashboardNearbyShops.slice(0, 6),
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNearbyShops)

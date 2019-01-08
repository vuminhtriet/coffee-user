import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../../dashboard/models'
// import { MODULE_NAME } from ''
import DashboardLocation from '../components/DashboardLocation'
import { BASE_URL } from '../../../common/models'
import { TEST_URL, GOOGLE_URL, API_KEY } from '../../../common/models'
import {
  setUserLocation,
  setUserLatLng
} from '../../../common/actions/common'
import { mapDispatchToProps as nearbySettingHandlers } from '../../dashboard/containers/DashboardNearbyShops'

const address = "34 Nghĩa Hòa, Phường 6, Tân Bình, Hồ Chí Minh, Vietnam"
const mapDispatchToProps = (dispatch, props) => ({
  getUserLocation: async (latitude, longitude) => {
    try {
      dispatch(setUserLatLng({"lat": latitude,"lng": longitude}))
      // dispatch(setUserLocation(address))
      const url = `${GOOGLE_URL}/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      const response = await axios({ url })
      console.log(response)
      if (response && response.data) {
        dispatch(setUserLocation(response.data.results[0].formatted_address))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  },
  ...nearbySettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  location: state.common.location,
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLocation)
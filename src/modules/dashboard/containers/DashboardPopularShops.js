import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../../dashboard/models'
// import { MODULE_NAME } from ''
import DashboardPopularShops from '../components/DashboardPopularShops'
import { BASE_URL } from '../../../common/models'
import { TEST_URL, GOOGLE_URL, API_KEY } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getDashboardPopularShops } from '../actions'
import {
  setUserLocation,
  setUserLatLng
} from '../../../common/actions/common'

const filter = {"where":{"isPopular":true},"order":"avgRating%20DESC","limit": 6}

const mapDispatchToProps = (dispatch, props) => ({
  getDashboardPopularShops: async (token) => {
    try {
      // const url = `${BASE_URL}/api/shops?filter=${JSON.stringify(filter)}`
      const url = `${TEST_URL}/api/shops?filter=${JSON.stringify(filter)}`
      // const url = `${BASE_URL}/api/shops/search?searchStr=&filter=${JSON.stringify(filter)}`
      // const url = `${BASE_URL}/api/shops/search?searchStr=&page=0&pageSize=${PAGE_SIZE}&sort=averageRatingValue DESC&options={}`
      const response = await axios({ url })
      if (response && response.data) {
        dispatch(getDashboardPopularShops([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  },
  getUserLocation: async (latitude, longitude) => {
    try {
      const url = `${GOOGLE_URL}/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      dispatch(setUserLatLng({"lat": latitude,"lng": longitude}))
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
  }
})

const mapStateToProps = state => ({
  shops: state[MODULE_NAME].dashboardPopularShops.slice(0, 6),
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPopularShops)

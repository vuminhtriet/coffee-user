import axios from 'axios'
import { connect } from 'react-redux'
import ShopLocationMap from '../components/ShopLocationMap'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME } from '../models'
import { TEST_URL, GOOGLE_URL, API_KEY } from '../../../common/models'
import {
  setTempAddress
} from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getLocation: async (latitude, longitude) => {
    try {
      const url = `${GOOGLE_URL}/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      const response = await axios({ url })
      console.log("get", response.data.results[0])
      console.log("url", url)
      if (response && response.data) {
        dispatch(setTempAddress(response.data.results[0]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token,
  result: state[MODULE_NAME].tempAddress
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopLocationMap)

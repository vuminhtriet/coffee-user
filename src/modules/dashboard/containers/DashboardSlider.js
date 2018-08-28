import { connect } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../../common/models'
import DashboardSlider from '../components/DashboardSlider'
import { MODULE_NAME } from '../models'
import { getBanners } from '../actions'
import moment from 'moment'

const filter = {
  where: {
    'status': 1,
    'fromDate': { 'lte': moment() },
    'toDate': { 'gte': moment() }
  },
  include: ['images'],
  order: 'priority ASC'
}

const mapDispatchToProps = (dispatch, props) => ({
  getBanners: async () => {
    try {
      const url = `${BASE_URL}/api/banners?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        // const newBanners = []
        // // TODO:
        // // response.data.map(item => item.fullUrl)
        // if (newBanners.length > 0) {
        //   dispatch(getBanners([...newBanners]))
        // }
        dispatch(getBanners([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  bannerData: state[MODULE_NAME].banner.filter(item => item.images && item.images.length > 0 && item.images[0].fullUrl)
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSlider)

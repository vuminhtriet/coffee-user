import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../../dashboard/models'
import DashboardPopularShops from '../components/DashboardPopularShops'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getDashboardPopularShops } from '../actions'

const filter = {
  'include': ['images','addresses'],
  'order': 'averageRatingValue DESC',
  'where': {
    'status': 1
  },
  'limit': PAGE_SIZE
}

const mapDispatchToProps = (dispatch, props) => ({
  getDashboardPopularShops: async (token) => {
    try {
      // const url = `${BASE_URL}/api/shops?filter=${JSON.stringify(filter)}`
      const url = `${TEST_URL}/api/shops?filter%5Bwhere%5D%5BisPopular%5D=true&filter[order]=shopRating%20DESC`
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
  }
})

const mapStateToProps = state => ({
  shops: state[MODULE_NAME].dashboardPopularShops.slice(0, 6)
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPopularShops)

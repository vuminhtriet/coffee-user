import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../../dashboard/models'
import DashboardPopularProducts from '../components/DashboardPopularProducts'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getDashboardPopularProducts } from '../actions'

const filter = {
  'include': [
    'images',
    'shop',
    {
      'relation': 'productPrices',
      'scope': {
        'where': {
          'status': 1
        },
        'include': [
          'cashUnit',
          'electricUnit',
          'promotionPrice'
        ]
      }
    }
  ],
  'where': {
    'status': 1
  },
  'limit': PAGE_SIZE
}

const mapDispatchToProps = (dispatch, props) => ({
  getPopularProducts: async (token) => {
    try {
      // const url = `${BASE_URL}/api/products?filter=${JSON.stringify(filter)}`
      const url = `${TEST_URL}/api/products?filter%5Bwhere%5D%5BproductIsPopular%5D=true&filter[order]=productTotalRating%20DESC`
      const response = await axios({ url })
      if (response && response.data) {
        dispatch(getDashboardPopularProducts([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].dashboardPopularProducts.slice(0, 6),
  currencyUnits: state.common.units
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPopularProducts)

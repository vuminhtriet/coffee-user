import axios from 'axios'
import { connect } from 'react-redux'
import DashboardProductToday from '../components/DashboardProductToday'
import { getTodayProducts } from '../actions'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'

// const filter = {
//   'include': [
//     'images',
//     'shop',
//     {
//       'relation': 'productPrices',
//       'scope': {
//         'where': {
//           'status': 1
//         },
//         'include': [
//           'cashUnit',
//           'electricUnit',
//           'promotionPrice'
//         ]
//       }
//     }
//   ],
//   'where': {
//     'status': 1
//   },
//   'limit': 20,
//   'order': 'createdAt DESC'
// }
const filter = {"include":{"relation":"shop","scope":{"fields":"shopName"}},"order":"productCreatedAt%20DESC"}

const mapDispatchToProps = (dispatch, props) => ({
  getTodayProducts: async () => {
    try {
      // const url = `${BASE_URL}/api/products?filter=${JSON.stringify(filter)}`
      // const url = `${TEST_URL}/api/products?filter[order]=dateCreatedAt%20DESC`
      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        dispatch(getTodayProducts([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].todayProducts.slice(0,15)
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardProductToday)

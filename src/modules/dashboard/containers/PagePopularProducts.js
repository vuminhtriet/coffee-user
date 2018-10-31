import axios from 'axios'
import { connect } from 'react-redux'
import PagePopularProducts from '../components/PagePopularProducts'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getPopularProducts, loadMorePopularProducts } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getPopularProducts: async (page = 0, sort = 'productTotalRating DESC', options = {}) => {
    try {
      const filter = {"include":{"relation":"shop","scope":{"fields":"shopName"}},"where":{"productIsPopular":true},"order":sort}
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
      //   'limit': PAGE_SIZE
      // }
      // const url = `${BASE_URL}/api/products?filter=${JSON.stringify(filter)}`
      // const filter = {
      //   'include': ['shop']
      // }
      // const url = `${BASE_URL}/api/products/search?searchStr=&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      // const url = `${TEST_URL}/api/products?filter%5Bwhere%5D%5BproductIsPopular%5D=true&filter[order]=${sort}`
      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
        if (page === 0) {
          dispatch(getPopularProducts([...response.data]))
        } else {
          dispatch(loadMorePopularProducts([...response.data]))
        }
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].popularProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(PagePopularProducts)

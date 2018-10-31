import { connect } from 'react-redux'
import axios from 'axios'
import PageCategoryProduct from '../components/PageCategoryProduct'
import { getCategoryProducts, loadMoreCategoryProducts } from '../actions'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'

const mapDispatchToProps = (dispatch, props) => ({
  getCategoryProducts: async (categoryId, shopId, page = 0, sort = 'productTotalRating DESC', options = {}) => {
    try {
      // const filter = {
      //   'include': [
      //     'images',
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
      //   'limit': PAGE_SIZE,
      //   'offset': page * PAGE_SIZE,
      //   'order': sort
      // }
      // const url = `${BASE_URL}/api/publicCategories/${categoryId}/product?filter=${JSON.stringify(filter)}` // ?filter=${JSON.stringify(filter)}

      // const url = `${BASE_URL}/api/products/category-product?categoryId=${categoryId}&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      const filter = {"include":{"relation":"shop","scope":{"fields":"shopName"}},"where":{"categoryId":categoryId,"shopId":shopId},"order":sort}
      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        if (page === 0) {
          dispatch(getCategoryProducts([...response.data]))
        } else {
          dispatch(loadMoreCategoryProducts([...response.data]))
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
  products: state[MODULE_NAME].categoryProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(PageCategoryProduct)

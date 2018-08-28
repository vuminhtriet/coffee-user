import { connect } from 'react-redux'
import axios from 'axios'
import PageCategoryProduct from '../components/PageCategoryProduct'
import { getCategoryProducts, loadMoreCategoryProducts } from '../actions'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'

const mapDispatchToProps = (dispatch, props) => ({
  getCategoryProducts: async (categoryId, page = 0, sort = 'totalView DESC', options = {}) => {
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

      const url = `${BASE_URL}/api/products/category-product?categoryId=${categoryId}&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
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

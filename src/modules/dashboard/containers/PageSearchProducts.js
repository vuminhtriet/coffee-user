import axios from 'axios'
import { connect } from 'react-redux'
import PageSearchProducts from '../components/PageSearchProducts'
import { MODULE_NAME } from '../models'
import { getSearchProducts, loadMoreSearchProducts } from '../actions'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'


const mapDispatchToProps = (dispatch, props) => ({
  searchProducts: async (keyword, page = 0, sort = "productTotalRating DESC", options = {}) => {
    try {
      const filter = {"include":{"relation":"shop","scope":{"fields":"shopName"}},"where":{"productName":{"like":keyword,"options":"i"}},"order":sort}
      // const url = `${BASE_URL}/api/products/search?searchStr=${keyword}&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      // const url = `${TEST_URL}/api/products/?filter%5Bwhere%5D%5BproductName%5D%5Blike%5D=${keyword}&filter[order]=${sort}`
      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
        if (page === 0) {
          dispatch(getSearchProducts([...response.data]))
        } else {
          dispatch(loadMoreSearchProducts([...response.data]))
        }
        return true
      }
    } catch (e) {
      console.log(e);
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].searchProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(PageSearchProducts)

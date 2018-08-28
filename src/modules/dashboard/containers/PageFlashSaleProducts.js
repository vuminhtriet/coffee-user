import axios from 'axios'
import { connect } from 'react-redux'
import PageFlashSaleProducts from '../components/PageFlashSaleProducts'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getFlashSaleProducts, loadMoreFlashSaleProducts } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getFlashSaleProducts: async (page = 0, sort = 'totalView DESC', options = {}) => {
    try {
      const url = `${BASE_URL}/api/products/flash-sale?page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      const response = await axios({ url })
      if (response && response.data) {
        if (page === 0) {
          dispatch(getFlashSaleProducts([...response.data]))
        } else {
          dispatch(loadMoreFlashSaleProducts([...response.data]))
        }
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => {
  return {
    products: state[MODULE_NAME].flashSaleProducts,
    currencyUnits: state['common'].units
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageFlashSaleProducts)

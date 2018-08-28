import axios from 'axios'
import { connect } from 'react-redux'
import DashboardFlashSaleProducts from '../components/DashboardFlashSaleProducts'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getFlashSaleProducts } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getFlashSaleProducts: async () => {
    try {
      const url = `${BASE_URL}/api/products/flash-sale`
      const response = await axios({ url })
      if (response && response.data) {
        dispatch(getFlashSaleProducts([...response.data]))
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFlashSaleProducts)

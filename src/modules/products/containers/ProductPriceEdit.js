import axios from 'axios'
import { connect } from 'react-redux'
import ProductPriceEdit from '../components/ProductPriceEdit'
import { MODULE_NAME as MODULE_ORDER } from '../../order/models'

const mapDispatchToProps = (dispatch, props) => ({
  getProducts: () => {
    try {
      // TODO: axios.get().....
    } catch (e) {

    }
  }
})

const mapStateToProps = state => ({
  units: state.common.units
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPriceEdit)

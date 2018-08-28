import axios from 'axios'
import { connect } from 'react-redux'
import ProductList from '../components/ProductList'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  getProducts: () => {
    try {
      // TODO: axios.get().....
    } catch (e) {

    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].products
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)

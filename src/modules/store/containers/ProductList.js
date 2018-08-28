import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setStoreProducts } from '../actions'
import ProductList from '../components/ProductList'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
  // products: state[MODULE_NAME].products
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)

import axios from 'axios'
import { connect } from 'react-redux'
import ProductAddToCart from '../components/ProductAddToCart'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { onChangeProduct } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddToCart)

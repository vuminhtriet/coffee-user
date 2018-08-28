import axios from 'axios'
import { connect } from 'react-redux'
import ProductSubMenu from '../components/ProductSubMenu'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as MODULE_PRODUCT_DETAIL } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => {
  return {
    user: state[MODULE_USER].user,
    token: state[MODULE_USER].token,
    totalItem: state[MODULE_PRODUCT_DETAIL].cartSummary.totalItem
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSubMenu)

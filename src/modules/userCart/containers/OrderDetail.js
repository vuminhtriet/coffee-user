import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import OrderDetail from '../components/OrderDetail'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  shopPayments: state[MODULE_SHOP].shopPayments
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)

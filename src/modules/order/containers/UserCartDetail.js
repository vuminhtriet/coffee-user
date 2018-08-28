import axios from 'axios'
import { connect } from 'react-redux'
import { changeCart } from '../../shop/actions'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import UserCartDetail from '../components/UserCartDetail'

const mapDispatchToProps = (dispatch, props) => ({
  confirmCart: (order) => {
    // TODO: submit to server
    dispatch(changeCart(order))
  }
})

const mapStateToProps = state => ({
  shopPayments: state[MODULE_SHOP].shopPayments
})

export default connect(mapStateToProps, mapDispatchToProps)(UserCartDetail)

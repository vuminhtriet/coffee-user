import axios from 'axios'
import { connect } from 'react-redux'
import StoreSubMenu from '../components/StoreSubMenu'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as MODULE_PRODUCT_DETAIL } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token
})

export default connect(mapStateToProps, mapDispatchToProps)(StoreSubMenu)

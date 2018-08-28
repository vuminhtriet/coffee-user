// import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../models'
// import { BASE_URL } from '../../../common/models'
// import { setProduct } from '../actions'
import ProductManagement from '../components/ProductManagement'
import { mapDispatchToProps as shopSettingHandlers } from './ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  ...shopSettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].shopProducts,
  units: state.common.units,
  shop: state[MODULE_NAME].shop
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductManagement)

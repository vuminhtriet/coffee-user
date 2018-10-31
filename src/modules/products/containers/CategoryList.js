import axios from 'axios'
import { connect } from 'react-redux'
import CategoryList from '../components/CategoryList'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/models'
import { mapDispatchToProps as categorySettingHandlers } from '../../shop/containers/CategoryList'

const mapDispatchToProps = (dispatch, props) => ({
  ...categorySettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  categories: state[MODULE_SHOP].shopCategories,
  shop: state[MODULE_SHOP].shop
  // publicCategories: state[MODULE_DASHBOARD].categories.filter(item => item.totalProduct >= 0)
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)

import axios from 'axios'
import { connect } from 'react-redux'
import CategoryList from '../components/CategoryList'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/models'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  categories: state[MODULE_SHOP].shopCategories,
  publicCategories: state[MODULE_DASHBOARD].categories.filter(item => item.totalProduct >= 0)
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)

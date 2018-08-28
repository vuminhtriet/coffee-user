import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setStoreCategories } from '../actions'
import CategoryList from '../components/CategoryList'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
  // categories: state[MODULE_NAME].categories
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)

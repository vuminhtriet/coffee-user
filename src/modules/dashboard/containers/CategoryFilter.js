import { connect } from 'react-redux'
import CategoryFilter from '../components/CategoryFilter'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  
})

const mapStateToProps = state => ({
  categories: state[MODULE_NAME].categories
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFilter)

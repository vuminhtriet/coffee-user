import axios from 'axios'
import { connect } from 'react-redux'
import ProductTitle from '../components/ProductTitle'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({})

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductTitle)

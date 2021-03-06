import axios from 'axios'
import { connect } from 'react-redux'
import AdditionalFees from '../components/AdditionalFees'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  units: state[MODULE_NAME].units
})

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalFees)

import { connect } from 'react-redux'
import DashboardHeaderSearch from '../components/DashboardHeaderSearch'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHeaderSearch)

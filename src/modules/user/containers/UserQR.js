import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import UserQR from '../components/UserQR'

export const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  user: state[MODULE_NAME].user
})

export default connect(mapStateToProps, mapDispatchToProps)(UserQR)

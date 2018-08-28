import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { setStoreInformation } from '../actions'
import StoreInformation from '../components/StoreInformation'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StoreInformation)

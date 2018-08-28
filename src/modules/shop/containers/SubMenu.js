import { connect } from 'react-redux'
import SubMenu from '../components/SubMenu'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => {
  return {
    token: state[MODULE_USER].token
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubMenu)

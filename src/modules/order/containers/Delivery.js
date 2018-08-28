import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import Delivery from '../components/Delivery'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => ({
  shopDeliveryMethods: state[MODULE_SHOP].shopDeliveryMethods
})

export default connect(mapStateToProps, mapDispatchToProps)(Delivery)

import { connect } from 'react-redux'
import Delivery from '../components/Delivery'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
  shippingTypes: state.common.shippingTypes
})

export default connect(mapStateToProps, mapDispatchToProps)(Delivery)

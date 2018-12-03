import { connect } from 'react-redux'
import LocationFilter from '../components/LocationFilter'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
  cities: state.common.cities
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationFilter)

import { connect } from 'react-redux'
import LocationFilter from '../components/LocationFilter'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
  countries: state.common.countries
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationFilter)

import { connect } from 'react-redux'
import PriceFilter from '../components/PriceFilter'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
  units: [{ id: '', code: 'All' }, ...state.common.units].map(item => {
    return { value: item.id, label: item.code }
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceFilter)

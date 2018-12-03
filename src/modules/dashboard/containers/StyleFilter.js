import { connect } from 'react-redux'
import StyleFilter from '../components/StyleFilter'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({
    styles: state.common.style
})

export default connect(mapStateToProps, mapDispatchToProps)(StyleFilter)

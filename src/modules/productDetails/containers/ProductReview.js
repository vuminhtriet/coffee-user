import axios from 'axios'
import { connect } from 'react-redux'
import ProductReview from '../components/ProductReview'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getProductRatings } from '../actions'
import { loading, fetch } from '../../../common/effects'

const mapDispatchToProps = (dispatch, props) => ({

})

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductReview)

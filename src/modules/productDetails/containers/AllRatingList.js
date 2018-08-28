import axios from 'axios'
import { connect } from 'react-redux'
import AllRatingList from '../components/AllRatingList'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getProductRatings, getTotalRatingValue, getTotalUserRating } from '../actions'
import { loading, fetch } from '../../../common/effects';

const mapDispatchToProps = (dispatch, props) => ({
  getProductRatings: async (productId) => {
    try {
      const filter = {
        where: {
          status: 1
        },
        include: { 'productRatings': { 'user': 'images' } },
        order: 'createdAt DESC'
      }
      const url = `${BASE_URL}/api/products/${productId}?filter=${JSON.stringify(filter)}`
      const response = await fetch({
        url,
      }, dispatch)
      if (response && response.data) {
        dispatch(getProductRatings(response.data.productRatings))
        dispatch(getTotalRatingValue(response.data.totalRatingValue))
        dispatch(getTotalUserRating(response.data.totalUserRating))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  ratings: state[MODULE_NAME].productRatings
})

export default connect(mapStateToProps, mapDispatchToProps)(AllRatingList)

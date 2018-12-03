import axios from 'axios'
import { connect } from 'react-redux'
import AllRatingList from '../components/AllRatingList'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getProductRatings, getTotalRatingValue, getTotalUserRating } from '../actions'
import { loading, fetch } from '../../../common/effects';

const mapDispatchToProps = (dispatch, props) => ({
  getProductRatings: async (productId) => {
    try {
      const filter =
      {
        "where": {
          "productId": productId
        },
        "include":{
            "relation":"member"
          }
      }
      const url = `${TEST_URL}/api/reviewproducts?filter=${JSON.stringify(filter)}`
      const response = await fetch({
        url,
      }, dispatch)
      if (response && response.data) {
        dispatch(getProductRatings(response.data))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  productRatings: state[MODULE_NAME].productRatings
})

export default connect(mapStateToProps, mapDispatchToProps)(AllRatingList)

import axios from 'axios'
import { connect } from 'react-redux'
import AllRatingList from '../components/AllRatingList'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getStoreRatings } from '../actions'
import { loading, fetch } from '../../../common/effects';

const mapDispatchToProps = (dispatch, props) => ({
  getavgRatings: async (shopId) => {
    try {
      const filter = {
        "where": {
          "shopId": shopId
        },
        "include":{
            "relation":"member"
           }
      }
      const url = `${TEST_URL}/api/reviewshops?filter=${JSON.stringify(filter)}`
      const response = await fetch({
        url,
      }, dispatch)
      if (response && response.data) {
        dispatch(getStoreRatings(response.data))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  storeRatings: state[MODULE_NAME].storeRatings
})

export default connect(mapStateToProps, mapDispatchToProps)(AllRatingList)

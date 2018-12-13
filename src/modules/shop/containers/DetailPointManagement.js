import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import DetailPointManagement from '../components/DetailPointManagement'
import {
    getUserPoints,
    loadMoreUserPoints,
    getDetailPointLists,
    loadMoreDetailPointLists
  } from '../actions'

export const mapDispatchToProps = (dispatch, props) => ({
    getDetailPoints: async (userPoint, page = 0, sort = 'avgRating DESC') => {
        try {
          var filter = {
            "where":{
                "memberId": userPoint.memberId,
                "shopId": userPoint.shopId
            },
            "order":sort
          }
    
          const url = `${TEST_URL}/api/points?filter=${JSON.stringify(filter)}`
          const response = await axios({
            url
          })
          if (response && response.data) {
            if (response.data.length === 0) {
              return false
            }
            if (page === 0) {
              dispatch(getDetailPointLists([...response.data]))
            } else {
              dispatch(loadMoreDetailPointLists([...response.data]))
            }
            return true
          }
          return false
        } catch (error) {
          return false
        }
      },
})

const mapStateToProps = state => ({
  user: state[MODULE_NAME].user,
  token: state[MODULE_NAME].token,
  pointDetailLists: state[MODULE_NAME].pointDetailLists,
})

export default connect(mapStateToProps, mapDispatchToProps)(DetailPointManagement)

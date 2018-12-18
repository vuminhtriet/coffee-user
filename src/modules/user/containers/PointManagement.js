import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import PointManagement from '../components/PointManagement'
import {
    getUserPoints,
    loadMoreUserPoints,
    getDetailPointLists,
    loadMoreDetailPointLists
  } from '../actions'

export const mapDispatchToProps = (dispatch, props) => ({
    getUserPoints: async (user, page = 0, sort = 'point DESC') => {
        try {
          var filter = {
            "where":{
                "memberId": user.id
            },
            "include":{
              "relation":"shop"
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
              dispatch(getUserPoints([...response.data]))
            } else {
              dispatch(loadMoreUserPoints([...response.data]))
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
  // userPoints: state[MODULE_NAME].userPoints,
  userPoints: (() => {
    // let finalLists = []
    // state[MODULE_NAME].userPoints.map(item => {
    //   if(finalLists.length === 0){
    //     finalLists.push(item)
    //   }
    //   else {
    //     finalLists.map(item1 => {
    //       if(item1.shopId !== item.shopId){
    //         finalLists.push(item)
    //       }
    //       else{
    //         item1.point += item.point
    //       }
    //     })
    //   }
    // })
    var result = [];
    state[MODULE_NAME].userPoints.reduce(function (res, value) {
        if (!res[value.shopId]) {
            res[value.shopId] = {
                point: 0,
                shopId: value.shopId,
                memberId: value.memberId,
                shop: value.shop
            };
            result.push(res[value.shopId])
        }
        res[value.shopId].point += value.point
        return res;
    }, {})
    return result.sort(function(a, b){return b.point-a.point})
  })(),
})

export default connect(mapStateToProps, mapDispatchToProps)(PointManagement)

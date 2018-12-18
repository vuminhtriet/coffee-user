// import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../models'
// import { BASE_URL } from '../../../common/models'
// import { setProduct } from '../actions'
import PointManagement from '../components/PointManagement'
import { mapDispatchToProps as shopSettingHandlers } from './ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  ...shopSettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  // userPoints: state[MODULE_NAME].userPoints,
  userPoints: (() => {
    let finalLists = []
    let temp = state[MODULE_NAME].userPoints
    // state[MODULE_NAME].userPoints.map(item => {
    //   if(temp.length === 0){
    //     finalLists.push(item)
    //   }
    //   else {
    //     temp.map((item1, index) => {
    //       if(item1.memberId !== item.memberId){
    //         finalLists.push(item)
    //       }
    //       else{
    //         finalLists[index].point += item.point
    //       }
    //     })
    //   }
    //   temp = finalLists
    //   return true
    // })
    
    var result = [];
    state[MODULE_NAME].userPoints.reduce(function (res, value) {
        if (!res[value.memberId]) {
            res[value.memberId] = {
                point: 0,
                memberId: value.memberId,
                shopId: value.shopId,
                member: value.member
            };
            result.push(res[value.memberId])
        }
        res[value.memberId].point += value.point
        return res;
    }, {})

    return result.sort(function(a, b){return b.point-a.point})
  })(),
  shop: state[MODULE_NAME].shop
})

export default connect(mapStateToProps, mapDispatchToProps)(PointManagement)

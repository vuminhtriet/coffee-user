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
    state[MODULE_NAME].userPoints.map(item => {
      if(finalLists.length === 0){
        finalLists.push(item)
        return true
      }
      else {
        finalLists.map(item1 => {
          if(item1.memberId !== item.memberId){
            finalLists.push(item)
            return true
          }
          else{
            item1.point += item.point
            return true
          }
        })
      }
    })
    return finalLists.sort(function(a, b){return b.point-a.point})
  })(),
  shop: state[MODULE_NAME].shop
})

export default connect(mapStateToProps, mapDispatchToProps)(PointManagement)

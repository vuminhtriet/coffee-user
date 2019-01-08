import axios from 'axios'
import { connect } from 'react-redux'
import VisitedProducts from '../components/VisitedProducts'
import { MODULE_NAME } from '../models'
import { getVisitedProducts } from '../actions'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'


const mapDispatchToProps = (dispatch, props) => ({
    getVisitedProducts: async (user, sort = "clicked DESC") => {
    try {
      var filter = {
        "include":{
            "relation":"product",
            "scope":{
              "include":{
                "relation":"shop",
                "scope":{
                  "fields":"shopName"
                }
              }
            }
          },
        "where":{
           "memberId": user.id
        },
        "limit": 6,
        "order":sort
      }
      
      const url = `${TEST_URL}/api/clickproducts?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        dispatch(getVisitedProducts([...response.data]))
        return true
      }
    } catch (e) {
      console.log(e);
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].visitedProducts.slice(0, 6),
  user: state[MODULE_USER].user
})

export default connect(mapStateToProps, mapDispatchToProps)(VisitedProducts)

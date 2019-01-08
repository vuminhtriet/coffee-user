import axios from 'axios'
import { connect } from 'react-redux'
import RecommendProducts from '../components/RecommendProducts'
import { MODULE_NAME } from '../models'
import { getRecommendProducts } from '../actions'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'


const mapDispatchToProps = (dispatch, props) => ({
    getRecommendProducts: async (keyword, sort = "avgRating DESC") => {
    try {
      var filter = {
        "include":{
           "relation":"shop",
           "scope":{
              "fields":"shopName"
           }
        },
        "where":{
           "productName":{
              "like":keyword,
              "options":"i"
           }
        },
        "order":sort,
        "limit":6
      }
      
      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        dispatch(getRecommendProducts([...response.data]))
        return true
      }
    } catch (e) {
      console.log(e);
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].recommendProducts.slice(0, 6),
  user: state[MODULE_USER].user
})

export default connect(mapStateToProps, mapDispatchToProps)(RecommendProducts)

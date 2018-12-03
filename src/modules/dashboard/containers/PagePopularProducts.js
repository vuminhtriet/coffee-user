import axios from 'axios'
import { connect } from 'react-redux'
import PagePopularProducts from '../components/PagePopularProducts'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getPopularProducts, loadMorePopularProducts } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getPopularProducts: async (page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
      var filter = {
        "include":{
           "relation":"shop",
           "scope":{
              "fields":"shopName"
           }
        },
        "where":{
           "productIsPopular":true
        },
        "order":sort
     }

     {options.cityId && !options.max &&
      (filter = {
        "where":{
         "productIsPopular":true,
         "address.cityId":options.cityId,
         "address.districtId":options.districtId
        },
        "include":{
         "relation":"shop",
         "scope":{
            "fields":"shopName"
         }
         },
        "order": sort
      })
    }

     {!options.cityId && options.max > 0 && !options.min &&
      (filter = {
        "where":{
         "productIsPopular":true,
         "productPrice":{"lte":options.max}
        },
        "include":{
         "relation":"shop",
         "scope":{
            "fields":"shopName"
         }
         },
        "order": sort
      })
    }

    {!options.cityId && options.max > 0 && options.min &&
      (filter = {
        "where":{
         "productIsPopular":true,
         "and":[{"productPrice":{"gte":options.min}},{"productPrice":{"lte":options.max}}]
        },
        "include":{
         "relation":"shop",
         "scope":{
            "fields":"shopName"
         }
         },
        "order": sort
      })
    }

    {options.cityId && options.max > 0 && !options.min &&
      (filter = {
        "where":{
         "productIsPopular":true,
            "address.cityId":options.cityId,
            "address.districtId":options.districtId,
            "productPrice":{"lte":options.max}
        },
        "include":{
         "relation":"shop",
         "scope":{
            "fields":"shopName"
         }
         },
        "order": sort
      })
    }

    {options.cityId && options.max > 0 && options.min &&
      (filter = {
        "where":{
          "productIsPopular":true,
            "address.cityId":options.cityId,
            "address.districtId":options.districtId,
            "and":[{"productPrice":{"gte":options.min}},{"productPrice":{"lte":options.max}}]
        },
        "include":{
         "relation":"shop",
         "scope":{
            "fields":"shopName"
         }
         },
        "order": sort
      })
    }

      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
        if (page === 0) {
          dispatch(getPopularProducts([...response.data]))
        } else {
          dispatch(loadMorePopularProducts([...response.data]))
        }
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].popularProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(PagePopularProducts)

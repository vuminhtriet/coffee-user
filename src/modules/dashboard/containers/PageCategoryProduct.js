import { connect } from 'react-redux'
import axios from 'axios'
import PageCategoryProduct from '../components/PageCategoryProduct'
import { getCategoryProducts, loadMoreCategoryProducts } from '../actions'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'

const mapDispatchToProps = (dispatch, props) => ({
  getCategoryProducts: async (categoryId, shopId, page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
      var filter = {
        "include":{
           "relation":"shop",
           "scope":{
              "fields":"shopName"
           }
        },
        "where":{
           "categoryId":categoryId,
           "shopId":shopId
        },
        "order":sort
     }

     {options.cityId && !options.max &&
      (filter = {
        "where":{
          "categoryId":categoryId,
          "shopId":shopId,
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
         "categoryId":categoryId,
           "shopId":shopId,
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
          "categoryId":categoryId,
          "shopId":shopId,
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
          "categoryId":categoryId,
          "shopId":shopId,
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
          "categoryId":categoryId,
           "shopId":shopId,
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
        if (page === 0) {
          dispatch(getCategoryProducts([...response.data]))
        } else {
          dispatch(loadMoreCategoryProducts([...response.data]))
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
  products: state[MODULE_NAME].categoryProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(PageCategoryProduct)

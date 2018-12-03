import axios from 'axios'
import { connect } from 'react-redux'
import PageSearchProducts from '../components/PageSearchProducts'
import { MODULE_NAME } from '../models'
import { getSearchProducts, loadMoreSearchProducts } from '../actions'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'


const mapDispatchToProps = (dispatch, props) => ({
  searchProducts: async (keyword, page = 0, sort = "avgRating DESC", options = {}) => {
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
        "order":sort
      }

      {options.cityId && !options.max &&
         (filter = {
           "where":{
            "productName":{
               "like":keyword,
               "options":"i"
            },
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
            "productName":{
               "like":keyword,
               "options":"i"
            },
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
            "productName":{
               "like":keyword,
               "options":"i"
            },
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
            "productName":{
               "like":keyword,
               "options":"i"
            },
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
            "productName":{
               "like":keyword,
               "options":"i"
            },
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
      const response = await axios({
        url
      })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
        if (page === 0) {
          dispatch(getSearchProducts([...response.data]))
        } else {
          dispatch(loadMoreSearchProducts([...response.data]))
        }
        return true
      }
    } catch (e) {
      console.log(e);
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].searchProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(PageSearchProducts)

import axios from 'axios'
import { connect } from 'react-redux'
import PageSearchShops from '../components/PageSearchShops'
import { MODULE_NAME } from '../models'
import { getSearchShops, loadMoreSearchShops } from '../actions'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'

const mapDispatchToProps = (dispatch, props) => ({
  searchShops: async (keyword, page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
      var filter = {
        "where":{
            "shopName":{
              "like":keyword,
              "options":"i"
            }
        },
        "order": sort
      }

      {options.cityId && !options.max &&
        (filter = {
          "where":{
              "shopName":{
                "like":keyword,
                "options":"i"
              },
              "address.cityId":options.cityId,
              "address.districtId":options.districtId
          },
          "order": sort
        })
      }

      {!options.cityId && options.max > 0 && !options.min &&
        (filter = {
          "where":{
              "shopName":{
                "like":keyword,
                "options":"i"
              }
          },
          "include":{
            "relation":"products", 
            "scope":{
              "where":{
                "productPrice":{"lte":options.max}
              }
            }
          },
          "order": sort
        })
      }

      {!options.cityId && options.max > 0 && options.min &&
        (filter = {
          "where":{
              "shopName":{
                "like":keyword,
                "options":"i"
              }
          },
          "include":{
            "relation":"products", 
            "scope":{
              "where":{
                "and":[
                  {"productPrice":{"gte":options.min}},
                  {"productPrice":{"lte":options.max}}
              ]
              }
            }
          },
          "order": sort
        })
      }

      {options.cityId && options.max > 0 && !options.min &&
        (filter = {
          "where":{
              "shopName":{
                "like":keyword,
                "options":"i"
              },
              "address.cityId":options.cityId,
              "address.districtId":options.districtId
          },
          "include":{
            "relation":"products", 
            "scope":{
              "where":{
                "productPrice":{"lte":options.max}
              }
            }
          },
          "order": sort
        })
      }

      {options.cityId && options.max > 0 && options.min &&
        (filter = {
          "where":{
              "shopName":{
                "like":keyword,
                "options":"i"
              },
              "address.cityId":options.cityId,
              "address.districtId":options.districtId
          },
          "include":{
            "relation":"products", 
            "scope":{
              "where":{
                  "and":[
                      {"productPrice":{"gte":options.min}},
                      {"productPrice":{"lte":options.max}}
                  ]
              }
            }
          },
          "order": sort
        })
      }

      if (options.styleId && options.styleId !== 14){
        filter.where["style.styId"] = options.styleId
      }
      
      const url = `${TEST_URL}/api/shops?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
        if (page === 0) {
          dispatch(getSearchShops([...response.data]))
        } else {
          dispatch(loadMoreSearchShops([...response.data]))
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
  shops: state[MODULE_NAME].searchShops.filter(item => !item.products || item.products.length),
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(PageSearchShops)

import axios from 'axios'
import { connect } from 'react-redux'
import PagePopularShops from '../components/PagePopularShops'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getPopularShops, loadMorePopularShops } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getPopularShops: async (page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
      var filter = {
        "where":{
          "isPopular": true
        },
        "order": sort
      }

      {options.cityId && !options.max &&
        (filter = {
          "where":{
            "isPopular": true,
              "address.cityId":options.cityId,
              "address.districtId":options.districtId
          },
          "order": sort
        })
      }

      {!options.cityId && options.max > 0 && !options.min &&
        (filter = {
          "where":{
            "isPopular": true
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
            "isPopular": true
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
            "isPopular": true,
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
            "isPopular": true,
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
        filter.where["styleId"] = options.styleId
      }

      const url = `${TEST_URL}/api/shops?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
        if (page === 0) {
          dispatch(getPopularShops([...response.data]))
        } else {
          dispatch(loadMorePopularShops([...response.data]))
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
  shops: state[MODULE_NAME].popularShops.filter(item => !item.products || item.products.length),
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(PagePopularShops)

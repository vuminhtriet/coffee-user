import axios from 'axios'
import { connect } from 'react-redux'
import PageBrandShops from '../components/PageBrandShops'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getBrandShops, loadMoreBrandShops } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getBrandShops: async (brandId, page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
      var filter = {
        "where":{
          "brandId": brandId
        },
        "order": sort
      }

      {options.cityId && !options.max &&
        (filter = {
          "where":{
            "brandId": brandId,
              "address.cityId":options.cityId,
              "address.districtId":options.districtId
          },
          "order": sort
        })
      }

      {!options.cityId && options.max > 0 && !options.min &&
        (filter = {
          "where":{
            "brandId": brandId
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
            "brandId": brandId
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
            "brandId": brandId,
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
            "brandId": brandId,
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
          dispatch(getBrandShops([...response.data]))
        } else {
          dispatch(loadMoreBrandShops([...response.data]))
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
  shops: state[MODULE_NAME].brandShops,
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(PageBrandShops)

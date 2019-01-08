import { connect } from 'react-redux'
import axios from 'axios'
import PageStyleShops from '../components/PageStyleShops'
import { getNearbyShops, loadMoreNearbyShops } from '../actions'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'

const mapDispatchToProps = (dispatch, props) => ({
  getStyleShops: async (styleId, page = 0, sort = 'avgRating DESC', options = {}) => {
    try {
        var filter = {
            "where":{
              "styleId": styleId
            },
            "order": sort
          }
    
          {options.cityId && !options.max &&
            (filter = {
              "where":{
                "styleId": styleId,
                  "address.cityId":options.cityId,
                  "address.districtId":options.districtId
              },
              "order": sort
            })
          }
    
          {!options.cityId && options.max > 0 && !options.min &&
            (filter = {
              "where":{
                "styleId": styleId
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
                "styleId": styleId
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
                "styleId": styleId,
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
                "styleId": styleId,
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

      const url = `${TEST_URL}/api/shops?filter=${JSON.stringify(filter)}`
      const response = await axios({ url })
      if (response && response.data) {
        if (page === 0) {
          dispatch(getNearbyShops([...response.data]))
        } else {
          dispatch(loadMoreNearbyShops([...response.data]))
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
  shops: state[MODULE_NAME].nearbyShops,
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(PageStyleShops)

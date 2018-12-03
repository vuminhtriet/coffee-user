import axios from 'axios'
import { connect } from 'react-redux'
import PageNearbyShops from '../components/PageNearbyShops'
import { MODULE_NAME } from '../models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getNearbyShops, loadMoreNearbyShops } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getNearbyShops: async (page = 0, sort = 'avgRating DESC', options = {}, latlng) => {
    try {
      var filter = {
        "where":{
           "shopLocation":{
              "near":[
                latlng.lat,
                latlng.lng
              ],
              "maxDistance":100,
              "unit":"kilometers"
           }
        },
        "order": sort
     }

    {options.cityId && !options.max &&
      (filter = {
        "where":{
          "shopLocation":{
            "near":[
              latlng.lat,
              latlng.lng
            ],
            "maxDistance":100,
            "unit":"kilometers"
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
          "shopLocation":{
            "near":[
              latlng.lat,
              latlng.lng
            ],
            "maxDistance":100,
            "unit":"kilometers"
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
          "shopLocation":{
            "near":[
              latlng.lat,
              latlng.lng
            ],
            "maxDistance":100,
            "unit":"kilometers"
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
          "shopLocation":{
            "near":[
              latlng.lat,
              latlng.lng
            ],
            "maxDistance":100,
            "unit":"kilometers"
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
          "shopLocation":{
            "near":[
              latlng.lat,
              latlng.lng
            ],
            "maxDistance":100,
            "unit":"kilometers"
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
      const response = await axios({ url })
      if (response && response.data) {
        // if (response.data.length === 0) {
        //   return false
        // }
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
  shops: state[MODULE_NAME].nearbyShops.filter(item => !item.products || item.products.length),
  latlng: state.common.latlng
})

export default connect(mapStateToProps, mapDispatchToProps)(PageNearbyShops)

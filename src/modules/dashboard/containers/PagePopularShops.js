import axios from 'axios'
import { connect } from 'react-redux'
import PagePopularShops from '../components/PagePopularShops'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'
import { getPopularShops, loadMorePopularShops } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getPopularShops: async (page = 0, sort = 'averageRatingValue DESC', options = {}) => {
    try {
      // const filter = {
      //   'include': [
      //     'images',
      //     {
      //       'relation': 'productPrices',
      //       'scope': {
      //         'where': {
      //           'status': 1
      //         },
      //         'include': [
      //           'cashUnit',
      //           'electricUnit',
      //           'promotionPrice'
      //         ]
      //       }
      //     }
      //   ],
      //   'where': {
      //     'status': 1
      //   },
      //   'limit': PAGE_SIZE,
      //   'offset': page * PAGE_SIZE,
      //   'order': sort
      // }
      // const url = `${BASE_URL}/api/products?filter=${JSON.stringify(filter)}`
      // if (keyword == ''){
        // const url = `${BASE_URL}/api/shops?page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      // }
      // else{
        const url = `${BASE_URL}/api/shops/search?searchStr=&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      // }
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
  shops: state[MODULE_NAME].popularShops
})

export default connect(mapStateToProps, mapDispatchToProps)(PagePopularShops)

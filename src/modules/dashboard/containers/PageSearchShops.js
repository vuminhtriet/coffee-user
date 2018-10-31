import axios from 'axios'
import { connect } from 'react-redux'
import PageSearchShops from '../components/PageSearchShops'
import { MODULE_NAME } from '../models'
import { getSearchShops, loadMoreSearchShops } from '../actions'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { PAGE_SIZE } from '../../../common/configs'

const mapDispatchToProps = (dispatch, props) => ({
  searchShops: async (keyword, page = 0, sort = 'shopRating DESC', options = {}) => {
    try {
      const filter = {"where":{"shopName":{"like":keyword,"options":"i"}},"order":sort}
      // const url = `${BASE_URL}/api/shops/search?searchStr=${keyword}&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}&options=${JSON.stringify(options)}`
      // const url = `${TEST_URL}/api/shops/?filter%5Bwhere%5D%5BshopName%5D%5Blike%5D=${keyword}&filter[order]=${sort}`
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
  shops: state[MODULE_NAME].searchShops
})

export default connect(mapStateToProps, mapDispatchToProps)(PageSearchShops)

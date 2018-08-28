import axios from 'axios'
import { connect } from 'react-redux'
import { BASE_URL } from '../../../common/models'
import { setShopCategories } from '../actions'
import CategoryList from '../components/CategoryList'
import { MODULE_NAME } from '../models'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  getPrivateCategories: async (shop) => {
    try {
      // const filter = {
      //   where: {
      //     status: 1
      //   }
      // }
      const url = `${BASE_URL}/api/privateCategories/${shop.id}/images`
      const response = await fetch({
        url
        // params: {
        //   filter
        // }
      }, dispatch)
      if (response && response.data) {
        return dispatch(setShopCategories(response.data))
      }
      return false
    } catch (error) {
      return false
    }
  },
  deleteCategory: async (token, shop, item) => {
    try {
      const url = `${BASE_URL}/api/shops/${shop.id}/privateCategories/${item.id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PUT',
          headers: {
            Authorization: token
          },
          data: {
            ...item,
            status: -1
          }
        }, dispatch)
        if (response && response.data) {
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  addCategory: async (token, shop, shopName) => {
    try {
      const url = `${BASE_URL}/api/privateCategories`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          headers: {
            Authorization: token
          },
          data: {
            name: shopName,
            shopId: shop.id,
            totalProduct: 0,
            status: 1
          }
        }, dispatch)
        if (response && response.data) {
          return true
        }
        return false
      })
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  categories: state[MODULE_NAME].shopCategories,
  shop: state[MODULE_NAME].shop,
  token: state[MODULE_USER].token
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)

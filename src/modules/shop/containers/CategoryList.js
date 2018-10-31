import axios from 'axios'
import { connect } from 'react-redux'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { setShopCategories } from '../actions'
import CategoryList from '../components/CategoryList'
import { MODULE_NAME } from '../models'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  getPrivateCategories: async (shop) => {
    try {
      const filter = {
        "include":{
          "relation":"categories",
          "scope":{
            "include":{
              "relation":"products",
              "scope":{
                "fields":"productName"
              }
            }
          }
        }
      }
      // const url = `${BASE_URL}/api/privateCategories/${shop.id}/images`
      const url = `${TEST_URL}/api/shops/${shop.id}?filter=${JSON.stringify(filter)}`
      const response = await fetch({
        url
        // params: {
        //   filter
        // }
      }, dispatch)
      if (response && response.data) {
        return dispatch(setShopCategories(response.data.categories))
      }
      return false
    } catch (error) {
      return false
    }
  },
  deleteCategory: async (token, shop, item) => {
    try {
      const url = `${TEST_URL}/api/categories/${item.id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'DELETE',
          // headers: {
          //   Authorization: token
          // },
          // data: {
          //   ...item,
          //   status: -1
          // }
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
  addCategory: async (token, shop, categoryName) => {
    try {
      const url = `${TEST_URL}/api/categories`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'POST',
          // headers: {
          //   Authorization: token
          // },
          data: {
            name: categoryName,
            shopId: shop.id
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

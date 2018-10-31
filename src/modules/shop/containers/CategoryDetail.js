import axios from 'axios'
import { connect } from 'react-redux'
import { BASE_URL, TEST_URL } from '../../../common/models'
import CategoryDetail from '../components/CategoryDetail'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { mapDispatchToProps as shopHandler } from './ShopSetting'
import { mapDispatchToProps as categoryHandler } from './CategoryList'
import { fetch, loading } from '../../../common/effects'

const mapDispatchToProps = (dispatch, props) => ({
  getProductsInCategories: async (id, shop) => {
    try {
      // const url = `${BASE_URL}/api/privateCategories/${id}/product`
      // const url = `${TEST_URL}/api/products?filter[where][categoryId]=${id}&filter[where][shopId]=${shop.id}&filter[order]=${sort}`
      const filter = {"include":{"relation":"shop","scope":{"fields":"shopName"}},"where":{"categoryId":id,"shopId":shop.id}}
      const url = `${TEST_URL}/api/products?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url
        }, dispatch)
        if (response && response.data) {
          return response.data
        }
        return false
      })
    } catch (error) {
      return false
    }
  },
  submit: async (token, category, shop, categoryName, deletes, add) => {
    try {
      const result = await loading(dispatch, async () => {
        if (categoryName !== category.name) {
          await fetch({
            url: `${TEST_URL}/api/categories/${category.id}`,
            method: 'PATCH',
            // headers: {
            //   Authorization: token
            // },
            data: {
              name: categoryName
            }
          }, dispatch)
          .catch(error => console.log('Category name update', error.response))
        }
        await Promise.all(deletes.map(product => {
          return axios({
            url: `${TEST_URL}/api/products/${product.id}`,
            method: 'PATCH',
            // headers: {
            //   Authorization: token
            // },
            data: {
              categoryId: null
            }
          }).catch(error => console.log('DELETE product', error.response))
        }))
        await Promise.all(add.map(product => {
          return axios({
            url: `${TEST_URL}/api/products/${product.id}`,
            method: 'PATCH',
            // headers: {
            //   Authorization: token
            // },
            data: {
              categoryId: category.id
            }
          }).catch(error => console.log('ADD product', error.response))
        }))
        return true
      })
      return false
    } catch (error) {
      return false
    }
  },
  ...shopHandler(dispatch, props),
  ...categoryHandler(dispatch, props)
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].shopProducts,
  token: state[MODULE_USER].token,
  shop: state[MODULE_NAME].shop
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetail)

import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import ShopProduct from '../components/ShopProduct'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { getShopProducts } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getShopProducts: async (shopId) => {
    try {
      const filter = {
        include: [
          {
            'relation': 'productPrices',
            'scope': {
              'where': {
                'status': 1
              },
              'include': [
                'cashUnit',
                'electricUnit',
                'promotionPrice'
              ]
            }
          },
          'images'
        ],
        where: {
          'status': 1
        },
        limit: 10
      }
      const url = `${BASE_URL}/api/shops/${shopId}/products?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await axios({ url })
        if (response && response.data) {
          dispatch(getShopProducts(response.data))
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
  products: state[MODULE_NAME].shopProducts,
  currencyUnits: state.common.units
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopProduct)

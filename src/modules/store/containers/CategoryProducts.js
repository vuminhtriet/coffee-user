import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { getCategoryProducts } from '../actions'
import CategoryProducts from '../components/CategoryProducts'
import { MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  getCategoryProducts: async (id) => {
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
        }
      }
      const url = `${BASE_URL}/api/privateCategories/${id}/product?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        return dispatch(getCategoryProducts([...response.data]))
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  products: state[MODULE_NAME].categoryProducts
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryProducts)

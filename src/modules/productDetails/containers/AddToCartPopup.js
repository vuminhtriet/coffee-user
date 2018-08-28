
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import AddToCartPopup from '../components/AddToCartPopup'
import { BASE_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { fetch, loading } from '../../../common/effects'

const mapDispatchToProps = (dispatch, props) => ({
  onAddToCart: async ({
    user,
    shop,
    product,
    quantity,
    variantId,
    priceId,
    token
  }) => {
    try {
      const userId = user.id
      const shopId = shop.id
      const productId = product.id
      const address = user.addresses.find(item => item.isDefault)
      const price = product.productPrices.find(item => item.id === priceId)

      const metaData = {
        'title': `Ordering to ${shop.name}`,
        'createdAt': moment().format(),
        'updatedAt': moment().format(),
        'status': 0, // CART_STATUS[0] - Shopping
        'buyerNote': '',
        'userId': userId,
        'shopId': shopId,
        'addressId': address && address.id
      }
      const details = [
        {
          'quantity': quantity,
          'productVariationId': variantId,
          'cashValue': null,
          'electricValue': null,
          'productId': productId,
          'cashUnitId': price.cashUnitId,
          'electricUnitId': price.electricUnitId,
          'status': 1
        }
      ]
      const data = {
        metaData,
        details
      }
      const url = `${BASE_URL}/api/shoppingCarts/add-product-to-cart`

      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PATCH',
          headers: {
            Authorization: token
          },
          data
        }, dispatch)
        if (response && response.data) {
          return { success: true }
        }
        return { success: false, message: '' }
      })
    } catch (error) {
      return { success: false, message: error.data && error.data.error && error.data.error.message }
    }
  }
})

const mapStateToProps = state => {
  return {
    totalItem: state[MODULE_NAME].cartSummary.totalItem,
    user: state[MODULE_USER].user,
    token: state[MODULE_USER].token,
    currencyUnits: state.common.units
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartPopup)

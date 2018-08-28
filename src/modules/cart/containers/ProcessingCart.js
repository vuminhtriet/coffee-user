import axios from 'axios'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import ProcessingCart from '../components/ProcessingCart'
import { MODULE_NAME as MODULE_CART } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { setUserCarts } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  getUserCarts: (id, token) => {
    try {
      const filter = {
        where: {
          'orderStatus': 0,
          'status': {
            'neq': -1
          }
        },
        include: [
          'shop',
          'user',
          { 'shoppingCartAmounts': 'currencyUnit' },
          {
            'shoppingCartDetails': [
              {
                'relation': 'product',
                'scope': {
                  'include': [
                    {
                      'relation': 'productPrices',
                      'scope': {
                        'where': {
                          'status': 1
                        },
                        'include': [
                          'promotionPrice'
                        ]
                      }
                    }
                  ]
                }
              },
              {
                'relation': 'productVariation',
                'scope': {
                  'where': {
                    'status': 1
                  }
                }
              },
              {
                'relation': 'cashUnit',
                'scope': {
                  'where': {
                    'status': 1
                  }
                }
              },
              {
                'relation': 'electricUnit',
                'scope': {
                  'where': {
                    'status': 1
                  }
                }
              }
            ]
          },
          { 'shoppingCartPayments': 'paymentType' }
        ],
        order: 'updatedAt DESC'
      }
      const url = `${BASE_URL}/api/users/${id}/shoppingCarts?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          headers: {
            Authorization: token
          }
        }, dispatch)
        if (response && response.data) {
          dispatch(setUserCarts(response.data))
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
  carts: (() => {
    // TODO
    const finalCarts = state[MODULE_CART].userCarts.map(item => {
      if (item.status === 0) {
        const details = item.shoppingCartDetails
          ? item.shoppingCartDetails
            .filter(detail => {
              const product = detail.product
              const cash = (item.cashUnitId && item.cashUnit) || (!item.cashUnitId && !item.cashUnit)
              const electric = (item.electricUnitId && item.electricUnit) || (!item.electricUnitId && !item.electricUnit)
              const price = product && product.productPrices.find(elem => elem.cashUnitId === detail.cashUnitId && elem.electricUnitId === detail.electricUnitId)
              const variant = detail.productVariation
              return product && price && variant && cash && electric
            })
          : []

        const totalItem = details
          .reduce((result, detail) => result + detail.quantity, 0)

        const totalAmount = 'Not fixed yet'

        return { ...item, totalItem, totalAmount }
      } else {
        const totalItem = item.shoppingCartDetails.reduce((result, detail) => result + detail.quantity, 0)

        const totalAmount = item.shoppingCartAmounts
          ? item.shoppingCartAmounts
            .filter((amount) => amount.type === 1)
            .map(amount => `${amount.value}${amount.currencyUnit.code}`)
            .join(' + ')
          : 'TBC'

        return { ...item, totalItem, totalAmount }
      }
    })
    return finalCarts
  })(),
  token: state[MODULE_USER].token,
  id: state[MODULE_USER].user ? state[MODULE_USER].user.id : null
})

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingCart)

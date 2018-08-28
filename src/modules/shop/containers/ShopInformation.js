import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../models'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import ShopInformation from '../components/ShopInformation'
import { BASE_URL } from '../../../common/models'
import {
  setShopAddress,
  setShopInformation,
  setShopPayment,
  setShopDeliveryMethods } from '../actions'
import { mapDispatchToProps as shopSettingHandler } from './ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  ...shopSettingHandler(dispatch, props),
  getAllShopInfomation: async (promises) => {
    try {
      const result = await loading(dispatch, async () => {
        const response = await promises
        return response
      })
      return result
    } catch (err) {
      return []
    }
  },
  getShopAddress: async (shop, token) => {
    try {
      const url = `${BASE_URL}/api/shops/${shop.id}/addresses`
      const response = await axios({
        url,
        headers: {
          Authorization: token
        }
      })
      // TODO: fetch register
      if (response && response.data && response.data[0]) {
        dispatch(setShopAddress(response.data[0]))
        return response.data[0]
      }
      return false
    } catch (error) {
      return false
    }
  },
  updateShop: async (token, { shop, address }) => {
    try {
      const result = await loading(dispatch, async () => {
        const response = await Promise.all([
          fetch({
            url: `${BASE_URL}/api/shops/${shop.id}`,
            method: 'PATCH',
            headers: {
              Authorization: token
            },
            data: {
              ...shop
            }
          }, dispatch),
          fetch({
            url: `${BASE_URL}/api/addresses/${address.id}`,
            method: 'PATCH',
            headers: {
              Authorization: token
            },
            data: {
              ...address
            }
          }, dispatch)
        ])
        if (response && response.length) {
          const { 0: newShop, 1: newAddress } = response
          newAddress.data && dispatch(setShopAddress(newAddress.data))
          newShop.data && dispatch(setShopInformation(newShop.data))
          return true
        }
        return false
      })
      return result
    } catch (error) {
      return false
    }
  },
  getShopPaymentMethod: async (token, shop) => {
    try {
      const filter = {
        where: {
          status: 'active'
        },
        include: 'paymentType'
      }
      const url = `${BASE_URL}/api/shops/${shop.id}/shopPaymentMethods`
      const response = await axios({
        url,
        headers: {
          Authorization: token
        },
        params: {
          filter: JSON.stringify(filter)
        }
      })
      if (response && response.data) {
        dispatch(setShopPayment(response.data))
        return response.data
      }
      return false
    } catch (error) {
      return false
    }
  },
  getShopDeliveryMethod: async (token, shop) => {
    try {
      const url = `${BASE_URL}/api/shops/${shop.id}/shopShippingTypes`
      const response = await axios({
        url,
        headers: {
          Authorization: token
        }
      })
      if (response && response.data) {
        dispatch(setShopDeliveryMethods(response.data))
        return response.data
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  countries: state.common.countries,
  shop: state[MODULE_NAME].shop,
  token: state[MODULE_USER].token,
  user: state[MODULE_USER].user,
  shopAddress: state[MODULE_NAME].shopAddress,
  cities: state[MODULE_USER].cities
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopInformation)

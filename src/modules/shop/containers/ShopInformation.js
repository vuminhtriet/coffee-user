import axios from 'axios'
import { connect } from 'react-redux'
import { MODULE_NAME } from '../models'
import { fetch, loading } from '../../../common/effects'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import ShopInformation from '../components/ShopInformation'
import { BASE_URL, TEST_URL } from '../../../common/models'
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
      const url = `${TEST_URL}/api/shops/${shop.id}?filter={"fields":"address"}`
      const response = await axios({
        url
      })
      // TODO: fetch register
      if (response && response.data) {
        dispatch(setShopAddress(response.data.address))
        return response.data.address
      }
      return false
    } catch (error) {
      return false
    }
  },
  updateShop: async (token, shop, shopName, shopPhoneNumber, website, 
    selectedCity, selectedDistrict, fullAddress) => {
    try {
      const url = `${TEST_URL}/api/shops/${shop.id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PATCH',
          // headers: {
          //   Authorization: token
          // },
          data: {
            shopName: shopName,
            shopPhoneNumber: shopPhoneNumber,
            website: website || "",
            address: {
              cityId: selectedCity,
              districtId: selectedDistrict,
              fullAddress: fullAddress
            }
          }
        }, dispatch)
        if (response && response.data) {
          // const { 0: newShop, 1: newAddress } = response
          response.data.address && dispatch(setShopAddress({
            ...response.data.address
          }))
          response.data && dispatch(setShopInformation({
            ...response.data
          }))
          return true
        }
        return false
      })
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
  cities: state.common.cities,
  shop: state[MODULE_NAME].shop,
  token: state[MODULE_USER].token,
  user: state[MODULE_USER].user,
  shopAddress: state[MODULE_NAME].shopAddress
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopInformation)

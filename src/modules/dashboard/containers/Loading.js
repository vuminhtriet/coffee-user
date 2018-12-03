import axios from 'axios'
import { connect } from 'react-redux'
import Loading from '../components/Loading'
import { BASE_URL } from '../../../common/models'
import { TEST_URL, GOOGLE_URL, API_KEY } from '../../../common/models'
import {
  setCountries,
  setPaymentTypes,
  setCategories,
  setUnits,
  setShippingTypes,
  setCities,
  setUserLocation,
  setUserLatLng,
  setStyle
} from '../../../common/actions/common'

const style = [{"id": 1,"name":"Vintage"},{"id": 2,"name":"Scandinavian"},
{"id":3,"name":"Industrial"},{"id":4,"name":"Modern"}]

const mapDispatchToProps = (dispatch, props) => ({
  // getCountries: async () => {
  //   try {
  //     const url = `${BASE_URL}/api/countries`
  //     const response = await axios({
  //       url,
  //       timeout: 10000
  //     })
  //     if (response && response.data) {
  //       return dispatch(setCountries(response.data))
  //     }
  //     return false
  //   } catch (error) {
  //     return false
  //   }
  // },
  getCities: async () => {
    try {
      const url = `${TEST_URL}/api/cities`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setCities(response.data))
      }
      return false
    } catch (error) {
      return false
    }
  },
  getDefaultLocation: async () => {
    // try {
    //   const url = `${GOOGLE_URL}/maps/api/geocode/json?address=Ben+Thanh,+Ben+Thanh,+1,+HCM&key=${API_KEY}`
    //   const response = await axios({
    //     url,
    //     timeout: 10000
    //   })
    //   if (response && response.data) {
    //     dispatch(setUserLocation(response.data.results[0].formatted_address))
    //     return dispatch(setUserLatLng(response.data.results[0].geometry.location))
    //   }
    //   return false
    // } catch (error) {
    //   return false
    // }
    const location = 'Bến Thành, Quận 1, Hồ Chí Minh, Vietnam'
    const latlng = {
      "lat" : 10.7735994,
      "lng" : 106.6944173
    }
    dispatch(setUserLocation(location))
    return dispatch(setUserLatLng(latlng))
  },

  getStyle: async () => {
    try {
      const url = `${TEST_URL}/api/styles`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setStyle(response.data))
      }
      return false
    } catch (error) {
      return false
    }
  }

  // getPaymentTypes: async () => {
  //   try {
  //     const filter = {
  //       include: {
  //         'relation': 'currencyUnits',
  //         'scope': {
  //           'where': {
  //             'status': 1
  //           }
  //         }
  //       },
  //       where: {
  //         'status': 1
  //       }
  //     }
  //     const url = `${BASE_URL}/api/paymentTypes?filter=${JSON.stringify(filter)}`
  //     const response = await axios({
  //       url,
  //       timeout: 10000
  //     })
  //     if (response && response.data) {
  //       return dispatch(setPaymentTypes(response.data))
  //     }
  //     return false
  //   } catch (error) {
  //     return false
  //   }
  // },
  // getCurrencyUnits: async () => {
  //   try {
  //     const filter = {
  //       where: {
  //         'status': 1
  //       }
  //     }
  //     const url = `${BASE_URL}/api/currencyUnits?filter=${JSON.stringify(filter)}`
  //     const response = await axios({
  //       url,
  //       timeout: 10000
  //     })
  //     if (response && response.data) {
  //       return dispatch(setUnits(response.data))
  //     }
  //     return false
  //   } catch (error) {
  //     return false
  //   }
  // },
  // getCategories: async () => {
  //   try {
  //     const filter = {
  //       where: {
  //         'totalProduct': { 'gte': 0 },
  //         'status': 1
  //       },
  //       order: 'totalProduct DESC',
  //       include: {
  //         relation: 'images',
  //         scope: {
  //           order: 'createdAt DESC'
  //         }
  //       }
  //     }
  //     const url = `${BASE_URL}/api/publicCategories?filter=${JSON.stringify(filter)}`
  //     const response = await axios({
  //       url,
  //       timeout: 10000
  //     })
  //     if (response && response.data) {
  //       return dispatch(setCategories([...response.data]))
  //     }
  //     return false
  //   } catch (e) {
  //     return false
  //   }
  // },
  // getShippingTypes: async () => {
  //   try {
  //     const filter = {
  //       where: {
  //         'status': 1
  //       }
  //     }
  //     const url = `${BASE_URL}/api/shippingTypes?filter=${JSON.stringify(filter)}`
  //     const response = await axios({
  //       url,
  //       timeout: 10000
  //     })
  //     if (response && response.data) {
  //       return dispatch(setShippingTypes([...response.data]))
  //     }
  //     return false
  //   } catch (e) {
  //     return false
  //   }
  // },
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Loading)

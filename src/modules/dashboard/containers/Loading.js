import axios from 'axios'
import { connect } from 'react-redux'
import Loading from '../components/Loading'
import { BASE_URL } from '../../../common/models'
import {
  setCountries,
  setPaymentTypes,
  setCategories,
  setUnits,
  setShippingTypes,
  setCities
} from '../../../common/actions/common'

const mapDispatchToProps = (dispatch, props) => ({
  getCountries: async () => {
    try {
      const url = `${BASE_URL}/api/countries`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setCountries(response.data))
      }
      return false
    } catch (error) {
      return false
    }
  },
  getPaymentTypes: async () => {
    try {
      const filter = {
        include: {
          'relation': 'currencyUnits',
          'scope': {
            'where': {
              'status': 1
            }
          }
        },
        where: {
          'status': 1
        }
      }
      const url = `${BASE_URL}/api/paymentTypes?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setPaymentTypes(response.data))
      }
      return false
    } catch (error) {
      return false
    }
  },
  getCurrencyUnits: async () => {
    try {
      const filter = {
        where: {
          'status': 1
        }
      }
      const url = `${BASE_URL}/api/currencyUnits?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setUnits(response.data))
      }
      return false
    } catch (error) {
      return false
    }
  },
  getCategories: async () => {
    try {
      const filter = {
        where: {
          'totalProduct': { 'gte': 0 },
          'status': 1
        },
        order: 'totalProduct DESC',
        include: {
          relation: 'images',
          scope: {
            order: 'createdAt DESC'
          }
        }
      }
      const url = `${BASE_URL}/api/publicCategories?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setCategories([...response.data]))
      }
      return false
    } catch (e) {
      return false
    }
  },
  getShippingTypes: async () => {
    try {
      const filter = {
        where: {
          'status': 1
        }
      }
      const url = `${BASE_URL}/api/shippingTypes?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url,
        timeout: 10000
      })
      if (response && response.data) {
        return dispatch(setShippingTypes([...response.data]))
      }
      return false
    } catch (e) {
      return false
    }
  },
  getCities: async () => {
    try {
      const url = `${BASE_URL}/api/cities`
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
  }
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Loading)

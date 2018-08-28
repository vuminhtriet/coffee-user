import axios from 'axios'
import { connect } from 'react-redux'
import ProductPrice from '../components/ProductPrice'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'

const mapDispatchToProps = (dispatch, props) => ({
  getProducts: () => {
    try {
      // TODO: axios.get().....
    } catch (e) {

    }
  }
})

const mapStateToProps = state => ({
  units: (() => {
    const units = state.common.units
    const paymentTypes = state.common.paymentTypes
    const shopPayments = state[MODULE_SHOP].shopPayments
    const shopUnits = shopPayments
      .map(item => {
        const paymentType = paymentTypes.find(elem => elem.id === item.paymentTypeId)
        return paymentType.currencyUnits
      })
      .reduce((result, item) => [...result, ...item], [])
      .reduce((x, y) => {
        const unit = x.find(item => item.id === y.id)
        if (unit) {
          return x
        }
        return [...x, y]
      }, [])
      .filter(item => units.find(elem => elem.id === item.id))
    return [...shopUnits]
  })()
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPrice)

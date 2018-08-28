import axios from 'axios'
import { connect } from 'react-redux'
import ProductPrice from '../components/ProductPrice'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = state => {
  return {
    currencyUnits: state['common'].units
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPrice)

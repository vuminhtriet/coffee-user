import { connect } from 'react-redux'
import axios from 'axios'
import PageCategories from '../components/PageCategories'
import { MODULE_NAME } from '../models'
import { BASE_URL } from '../../../common/models'
import { getCategories } from '../actions'

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

const mapDispatchToProps = (dispatch, props) => ({
  getCategories: async () => {
    try {
      const url = `${BASE_URL}/api/publicCategories?filter=${JSON.stringify(filter)}`
      const response = await axios({
        url
      })
      if (response && response.data) {
        dispatch(getCategories([...response.data]))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => ({
  categories: state[MODULE_NAME].categories
})

export default connect(mapStateToProps, mapDispatchToProps)(PageCategories)

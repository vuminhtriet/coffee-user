import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'
import { setStoreCategories } from '../actions'
import CategoryList from '../components/CategoryList'
import { MODULE_NAME } from '../models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'

const mapDispatchToProps = (dispatch, props) => ({
  // getStoreCategories: async (id) => {
  //   try {
  //     const url = `${TEST_URL}/api/categories?filter[where][shopId]=${id}`
  //     // const url = `${TEST_URL}/api/categories`
  //     return loading(dispatch, async () => {
  //       const response = await axios({
  //         url
  //       })
  //       if (response && response.data) {
  //         dispatch(setStoreCategories([...response.data]))
  //         return true
  //       } else {
  //         return false
  //       }
  //     })
  //   } catch (e) {
  //     return false
  //   }
  // }
})

const mapStateToProps = state => ({
  // categories: state[MODULE_NAME].privateCategories
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)

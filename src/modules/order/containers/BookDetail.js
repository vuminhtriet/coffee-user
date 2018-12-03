import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetch, loading } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'
import { MODULE_NAME } from '../models'
import BookDetail from '../components/BookDetail'
import { MODULE_NAME as USER_MODULE } from '../../user/models'

export const mapDispatchToProps = (dispatch, props) => ({
  bookTable: (token, information, contact) => {
    try {
      const url = `${TEST_URL}/api/members/${user.id}`
      return loading(dispatch, async () => {
        const response = await fetch({
          url,
          method: 'PATCH',
          // headers: {
          //   Authorization: token
          // },
          data: {
            displayName: user.displayName,
            birthdate: moment(user.birthdate).format(),
            isMale: user.gender,
            address: {
              cityId: address.selectedCity,
              districtId: address.selectedDistrict,
              fullAddress: address.address
            }
          }
        }, dispatch)
        // TODO: fetch register
        if (response && response.data) {
          
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
  user: state[USER_MODULE].user,
  token: state[MODULE_NAME].token
})

export default connect(mapStateToProps, mapDispatchToProps)(BookDetail)

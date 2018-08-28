import axios from 'axios'
import { connect } from 'react-redux'
import SignUpForm from '../components/SignUpForm'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  requestSignup: (email) => {
    try {
      const url = `${BASE_URL}/api/users/register`
      return loading(dispatch, async () => {
        const response = await axios({
          url,
          method: 'POST',
          data: {
            email
          }
        })
        if (response && response.data && response.data.password) {
          return {
            success: true,
            password: response.data.password
          }
        }
        return { success: false, message: response.data.message }
      })
    } catch (error) {
      return { success: false }
    }
  }
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)

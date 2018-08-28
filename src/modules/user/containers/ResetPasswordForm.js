import axios from 'axios'
import { connect } from 'react-redux'
import { loading } from '../../../common/effects'
import { BASE_URL } from '../../../common/models'
import ResetPasswordForm from '../components/ResetPasswordForm'

const mapDispatchToProps = (dispatch, props) => ({
  createPassword: (password, token) => {
    try {
      const url = `${BASE_URL}/api/users/reset-password`
      return loading(dispatch, async () => {
        // const hashedPassword = sha256(password).toString()
        let response = await axios({
          url,
          method: 'POST',
          data: {
            newPassword: password
          },
          headers: {
            Authorization: token.token
          }
        })
        if (!response) {
          return false
        }
        return true
      })
    } catch (error) {
      return false
    }
  },
  verifyPassword: async (email, password) => {
    try {
      const url = `${BASE_URL}/api/users/validate-password`
      const response = await axios({
        url,
        method: 'POST',
        data: {
          email,
          password
        }
      })
      if (response && response.data && response.data.id) {
        return {
          ...response.data,
          token: response.data.id
        }
      }
      return false
    } catch (error) {
      return false
    }
  }
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm)

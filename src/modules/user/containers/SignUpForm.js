import axios from 'axios'
import { connect } from 'react-redux'
import {  Alert} from 'react-native'
import SignUpForm from '../components/SignUpForm'
import { loading } from '../../../common/effects'
import { setUserToken, setUserInfomation } from '../actions'
import { BASE_URL } from '../../../common/models'
import { TEST_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  // requestSignup: (email) => {
  //   try {
  //     const url = `${BASE_URL}/api/users/register`
  //     return loading(dispatch, async () => {
  //       const response = await axios({
  //         url,
  //         method: 'POST',
  //         data: {
  //           email
  //         }
  //       })
  //       if (response && response.data && response.data.password) {
  //         return {
  //           success: true,
  //           password: response.data.password
  //         }
  //       }
  //       return { success: false, message: response.data.message }
  //     })
  //   } catch (error) {
  //     return { success: false }
  //   }
  // }
  login: async (email, password) => {
    // TODO: Get user information here
    try {
      const result = await loading(dispatch, async () => {
        const response = await axios({
          url: `${TEST_URL}/api/members/login`,
          method: 'POST',
          data: {
            email,
            password
          }
        })
        if (!response && !response.data && !response.data.id) {
          return false
        }
        const { id, userId } = response.data
        // const filter = {
        //   include: [
        //     { 'addresses': 'country' },
        //     'shoppingCarts',
        //     {
        //       'relation': 'userPaymentMethods',
        //       'scope': {
        //         'where': {
        //           'shopId': null,
        //           'status': 'active'
        //         }
        //       }
        //     },
        //     'shop'
        //     // 'images'
        //   ]
        // }
        const response_ = await axios({
          url: `${TEST_URL}/api/members/${userId}`
        })
        if (response_ && response_.data) {
          dispatch(setUserInfomation(response_.data))
          dispatch(setUserToken(id))
          // response_.data.images.length > 0 && dispatch(setUserImage(response_.data.images[0]))
          return true
        }
        return Alert.alert(
          'CANT LOG IN',
          'SERVER ERROR',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
          ],
          { cancelable: false }
        )
      })
      return result
    } catch (error) {
      return Alert.alert(
        'CANT LOG IN',
        'SERVER ERROR',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        { cancelable: false }
      )
    }
  },
  signup: (email, password) => {
    try{
      return loading(dispatch, async () => {
        // const hashedPassword = sha256(password).toString()
        const response = await axios({
          url: `${TEST_URL}/api/Shops`,
          method: 'POST',
          data: {
            shopName: email.match(/^([^@]*)@/)[1]
          }
        })
        if (response && response.data) {
          const response_ = await axios({
            url: `${TEST_URL}/api/members`,
            method: 'POST',
            data: {
              email: email,
              password: password,
              shopId: response.data.id
            }
          })
          if(response_.data){
            return true
          }
        }
        return false
      })
    }catch(error){
      return false
    }
  }
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)

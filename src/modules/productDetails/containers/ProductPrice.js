import axios from 'axios'
import { connect } from 'react-redux'
import ProductPrice from '../components/ProductPrice'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { loading, fetch } from '../../../common/effects'
import { TEST_URL } from '../../../common/models'

const mapDispatchToProps = (dispatch, props) => ({
  updateClick: async (user, id) => {
    try {
      const filter = {
        "where":{
          "memberId": user.id,
          "productId": id
        }
      }
      const url = `${TEST_URL}/api/clickproducts?filter=${JSON.stringify(filter)}`
      return loading(dispatch, async () => {
        const response = await axios({ url })
        if (response && response.data && response.data.length > 0) {
          const objectId = response.data[0].id
          const url1 = `${TEST_URL}/api/clickproducts/${objectId}`
          const tempClicked = response.data[0].clicked + 1

          const response_ = await fetch({
            url: url1,
            method: 'PATCH',
            // headers: {
            //   Authorization: token
            // },
            data: {
              clicked: tempClicked
            }
          })
          console.log("patch",response_.data)

          if (response_ && response_.data) {
            return true
          } else {
            return false
          }
        }
        else if(response && response.data && response.data.length <= 0) {
          const url2 = `${TEST_URL}/api/clickproducts`
          const response_ = await fetch({
            url: url2,
            method: 'POST',
            // headers: {
            //   Authorization: token
            // },
            data: {
              memberId: user.id,
              productId: id,
              clicked: 1
            }
          })
          console.log("post",response_.data)

          if (response_ && response_.data) {
            return true
          } else {
            return false
          }
        }
        else {
          return false
        }
      })
    } catch (e) {
      return false
    }
  }
})

const mapStateToProps = state => {
  return {
    user: state[MODULE_USER].user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPrice)

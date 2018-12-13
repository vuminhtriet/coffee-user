import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import AddReceipt from '../components/AddReceipt'
import { loading, fetch } from '../../../common/effects'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { uploadProductImage } from '../../../common/firebase'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { mapDispatchToProps as shopSettingHandlers } from '../../shop/containers/ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  AddReceipt: async (token, receipt, shop) => {
    try {
      const url = `${TEST_URL}/api/points`
      const date = moment().format()
      const result = await loading(dispatch, async () => {

        let response = await axios({
          url,
          method: 'POST',
          // headers: {
          //   Authorization: token
          // },
          data: {
            memberId: receipt.memberId,
            code: receipt.code,
            money: receipt.money,
            point: receipt.point,
            shopId: shop.id,
            dateCreatedAt: date
          }
        })

        if (response && response.data) {

          return true
        }
        return false
      })
      return result
    } catch (e) {
      return false
    }
  },
  ...shopSettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  token: state[MODULE_USER].token,
  shop: state[MODULE_SHOP].shop
})

export default connect(mapStateToProps, mapDispatchToProps)(AddReceipt)

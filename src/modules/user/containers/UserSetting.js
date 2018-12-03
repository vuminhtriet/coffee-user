import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { BASE_URL, TEST_URL } from '../../../common/models'
import { loading, fetch } from '../../../common/effects'
import { uploadUserImage, deleteUserImage } from '../../../common/firebase'
import { mapDispatchToProps as ShopSettingHandler } from '../../shop/containers/ShopSetting'
import { mapDispatchToProps as UserHandler } from '../../user/containers/UserInformation'
import { setUserToken, setUserInfomation, setUserImage } from '../actions'
import { getShopProducts, setShopInformation, setShopImage } from '../../shop/actions'
import { setUserCarts } from '../../cart/actions'
import { onAddToCart } from '../../productDetails/actions'
import UserSetting from '../components/UserSetting'
import { MODULE_NAME } from '../models'

export const mapDispatchToProps = (dispatch, props) => ({
  logout: () => {
    dispatch(setUserToken(undefined))
    dispatch(setUserInfomation(undefined))
    dispatch(setUserImage(null))
    dispatch(getShopProducts([]))
    dispatch(setShopImage([]))
    dispatch(setShopInformation({}))
    dispatch(setUserCarts([]))
    dispatch(onAddToCart([]))
  },
  uploadUserImage: async (token, user, data) => {
    try {
      const result = await loading(dispatch, async () => {
        const date = moment().format()
        //delete
        if (data.delete) {
          const response = await fetch({
            url: data.delete.replace("download", "files"),
            method: 'DELETE'
          })
          if (response && response.data) {
            console.log(response.data)
          }
          else{
            console.log("error delete image")
          }
        }
        
        //add
        if (data.add) {
          let image = new FormData()
          image.append(date + data.add.fileName, {
            uri: data.add.fileUri,
            type: "image/jpeg",
            name: date + data.add.fileName
          })
          const response = await fetch({
            url: `${TEST_URL}/api/containers/drink2pics/upload`,
            method: 'POST',
            // headers: {
            //   'Accept': 'image/jpeg',
            //   'Content_Type': 'image/jpeg'
            // },
            data: image
          })
          if (response && response.data) {
            const response_ = await fetch({
              url: `${TEST_URL}/api/members/${user.id}`,
              method: 'PATCH',
              // headers: {
              //   Authorization: token
              // },
              data: {
                userPhoto: `${TEST_URL}/api/containers/drink2pics/download/${date + data.add.fileName}`
              }
            })
            if (response_ && response_.data) {
              console.log(response_.data)
            }
            else{
              console.log("error patch image")
            }
          }
          else{
            console.log("error upload image")
          }
        }

        return true
      })
      return result
    } catch (e) {
      console.log("error" + e)
      return false
    }
  },
  getUserImage: async (user) => {
    try {
      const images = await axios({
        url: `${TEST_URL}/api/members/${user.id}`
      })
      if (images && images.data) {
        dispatch(setUserImage(images.data.userPhoto && images.data.userPhoto.length > 0 
          ? images.data.userPhoto : null))
        return images.data
      }
      return false
    } catch (error) {
      return false
    }
  },
  ...ShopSettingHandler(dispatch, props),
  ...UserHandler(dispatch, props)
})

const mapStateToProps = state => ({
  user: state[MODULE_NAME].user,
  token: state[MODULE_NAME].token,
  userImage: state[MODULE_NAME].userImage
})

export default connect(mapStateToProps, mapDispatchToProps)(UserSetting)

import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { BASE_URL } from '../../../common/models'
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
        if (data.delete) {
          await deleteUserImage(data.delete.url)
            .catch(() => null)
            .then(response => {
              return fetch({
                url: `${BASE_URL}/api/images/${data.delete.id}`,
                method: 'DELETE',
                headers: {
                  Authorization: token
                }
              }, dispatch)
            }).catch(err => {
              console.log('DELETE IMAGE ERROR', err.response)
            })
        }
        // Edited
        const result = await uploadUserImage(user.id, data.add.fileName, data.add.resized
          ? data.add.resized.uri : data.add.fileUri)
          .then(response => {
            return fetch({
              url: `${BASE_URL}/api/images`,
              method: 'POST',
              headers: {
                Authorization: token
              },
              data: {
                type: 1,
                url: response.ref,
                fullUrl: response.downloadURL,
                size: response.totalBytes,
                userId: user.id,
                createdAt: moment().format()
              }
            }, dispatch)
          })
          .catch(err => {
            console.log('UPLOAD IMAGE ERROR', err.response)
          })
        return true
      })
      return result
    } catch (e) {
      return false
    }
  },
  getUserImage: async (user) => {
    try {
      const filter = {
        where: {
          userId: user.id
        }
      }
      const images = await axios({
        url: `${BASE_URL}/api/images`,
        params: {
          filter: JSON.stringify(filter)
        }
      })
      if (images.data) {
        dispatch(setUserImage(images.data.length > 0 ? images.data[0] : null))
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
